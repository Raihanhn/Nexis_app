import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ViewCampaign= ({ theme }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");

      if (!ref_db || !userid) return;

      try {
        const response = await axios.get("https://app.nexis365.com/api/get-campaigns", {
          params: { ref_db, userid }
        });

        if (response.data.success) {
          setCampaigns(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  const toggleExpandRow = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRowIndex(prev => (prev === index ? null : index));
    setActionMenuIndex(null); // close action menu if open
  };

  const toggleActionMenu = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActionMenuIndex(prev => (prev === index ? null : index));
  };

  const handleEdit = (item) => {
    console.log("Edit pressed for:", item);
  };

  const handleSuspend = (item) => {
    console.log("Suspend pressed for:", item);
  };

  return (
    <ScrollView>
      <View style={[styles.table, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }]}>
        <View style={styles.tableHeader}>
          {['Campaign Name', 'Plan', 'Priority', 'Status', ''].map((heading, index) => (
            <Text key={index} style={[styles.headerText, index === 4 && { flex: 0.5 }]}>{heading}</Text>
          ))}
        </View>

        {campaigns.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleExpandRow(index)}
              style={styles.tableRow}
            >
              <Text style={styles.cell}>{item.campaign_name}</Text>
              <Text style={styles.cell}>{item.plan}</Text>
              <Text style={styles.cell}>{item.priority}</Text>
              <Text style={styles.cell}>{item.status}</Text>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // prevent row expand
                  toggleActionMenu(index);
                }}
                style={styles.moreIconCell}
              >
                <Icon name="more-vert" size={22} color="#555" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Action Menu */}
            {actionMenuIndex === index && (
              <View style={styles.menuActions}>
                <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSuspend} onPress={() => handleSuspend(item)}>
                  <Text style={styles.buttonText}>Suspend</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Dropdown Detail */}
            {expandedRowIndex === index && (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownItem}><Text style={styles.label}>Manager:</Text> {item.employeeid}</Text>
                <Text style={styles.dropdownItem}><Text style={styles.label}>Start Date:</Text> {item.start_date}</Text>
                <Text style={styles.dropdownItem}><Text style={styles.label}>Possibility:</Text> {item.possibility}</Text>
                <Text style={styles.dropdownItem}><Text style={styles.label}>Opportunity:</Text> {item.opportunity}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ViewCampaign;

const styles = StyleSheet.create({
  table: {
    flex: 1,
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
    borderColor: '#ccc',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    color: '#333',
  },
  moreIconCell: {
    flex: 0.5,
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingLeft: 15,
    borderLeftWidth: 3,
    borderColor: '#007bff',
    marginBottom: 10,
  },
  dropdownItem: {
    marginBottom: 6,
    fontSize: 14,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
  },
  menuActions: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginBottom: 10,
    gap: 10,
  },
  buttonEdit: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonSuspend: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
