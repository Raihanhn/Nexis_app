import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { components } from '../components';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import CampaignForm from './CampaignForm';
import ViewCampaign from './ViewCampaign';
import LeadForm from './LeadForm';

const Lead = () => {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const renderHeader = () => (
    <components.Header
      logo={false}
      goBack={true}
      creditCard={true}
    />
  );

  const handlePress = (label) => {
    setSelectedAction(label);
    setShowDropdown(false);
  };


  const Content = () => (
    <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}>
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownToggleText}>Select Action ▼</Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Create Lead')}>
              <Text style={styles.dropdownItemText}>Create Lead</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Create Campaign')}>
              <Text style={styles.dropdownItemText}>Create Campaign</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('View Campaign')}>
              <Text style={styles.dropdownItemText}>View Campaign</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('View Lead')}>
              <Text style={styles.dropdownItemText}>View Lead</Text>
            </TouchableOpacity>
          </View>
        )}

      {selectedAction === 'Create Campaign' && <CampaignForm theme={theme} />}
      {selectedAction === 'Create Lead' && <LeadForm theme={theme} />}
      {selectedAction === 'View Campaign' && <ViewCampaign theme={theme} />}
      </ScrollView>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }}>
      {renderHeader()}
      {Content()}
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  dropdownToggle: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  dropdownToggleText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },

});

export default Lead;
