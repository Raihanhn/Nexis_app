import {View, Text, TouchableOpacity,StyleSheet, ScrollView} from 'react-native';
import React, {useState,useEffect} from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {components} from '../../components';
import {useTheme} from '../../constants/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from "moment";

const moreOptions = [
  {
    id: 1,
    title: 'My Task',
    icon: require('../../assets/icons/edit.png'),
  },
  {
    id: 2,
    title: 'My Jobs',
    icon: require('../../assets/icons/heart.png'),
  },
  {
    id: 3,
    title: 'My Expense',
    icon: require('../../assets/icons/card.png'),
  },
  {
    id: 4,
    title: 'Time Sheet',
    icon: require('../../assets/icons/file.png'),
  },
  {
    id: 5,
    title: 'My Payslip',
    icon: require('../../assets/icons/faq.png'),
  },
  {
    id: 6,
    title: 'My Profile',
    icon: require('../../assets/icons/scan.png'),
  },
 
 
];

const Timesheet = () => {
  const navigation = useNavigation();

  const {theme} = useTheme();

  const renderHeader = () => {
    return (
      <View style={{paddingHorizontal: 20,  padding:20,  backgroundColor: theme === 'dark' ? '#333' : '#fff',}}>
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 24,
          }}
        >
          More
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding:20,
          flexWrap: 'wrap',
          marginTop:10,
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
        }}
      >
        {moreOptions.map((option, index) => {
          const iconResponse = 8;

          return (
            <TouchableOpacity
              key={index}
              style={{
                // width: responsiveWidth(43),
                width: responsiveWidth(93),
                backgroundColor: '#21AFF0',
                marginBottom:20,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: responsiveWidth(3.4),
                flexDirection: 'row',
                alignItems: 'center',
                // marginBottom:30,
              }}
              onPress={() => {
                if (option.title === 'Create invoice') {
                  const url = `https://www.nexis365.com/saas/index.php?url=create_invoice.php&id=5161&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Create project') {
                  const url = `https://www.nexis365.com/saas/index.php?url=projects.php&id=5229&pstat=1&stat=&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Create task') {
                  const url = `https://www.nexis365.com/saas/index.php?url=task_manager.php&id=5228&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Create roster') {
                   const url = `https://www.nexis365.com/saas/index.php?url=schedule.php&id=48&sourcefrom=APP`;
                   navigation.navigate("Webview", { url });
                }
                if (option.title === 'Create payslip') {
                   const url = `https://www.nexis365.com/saas/index.php?url=pay_slip.php&id=51&sourcefrom=APP`;
                   navigation.navigate("Webview", { url });
                }
               
                if (option.title === 'General forms') {
                  const url = `https://www.nexis365.com/saas/index.php?url=general_forms.php&id=5205&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Complains') {
                  const url = `https://www.nexis365.com/saas/index.php?url=complaints.php&id=5204&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Employee') {
                  const url = `https://www.nexis365.com/saas/index.php?url=employees.php&id=59&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Client') {
                  const url = `https://www.nexis365.com/saas/index.php?url=clients.php&id=5226&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Receipt') {
                  const url = `https://www.nexis365.com/saas/index.php?url=receipt_voucher.php&id=5155&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Payment') {
                  const url = `https://www.nexis365.com/saas/index.php?url=payment_voucher.php&id=5156&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Office expense') {
                  const url = `https://www.nexis365.com/saas/index.php?url=office_expenses.php&id=5158&sourcefrom=APP`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'My Task') {
                  navigation.navigate("Task");
                }
                if (option.title === 'My Jobs') {
                  navigation.navigate("MyJobs");
                }
                if (option.title === 'My Payslip') {
                  const url = `https://www.nexis365.com/saas/index.php?url=pay_slip.php&id=5271`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'My Expense') {
                  const url = `https://www.nexis365.com/saas/index.php?url=my_expenses.php&id=5272`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Clock In-Out') {
                  const url = `https://www.nexis365.com/saas/index.php?url=clock_in-out.php&id=5199`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Daily Schedules') {
                  const url = `https://www.nexis365.com/saas/index.php?url=daily_schedules.php&id=5206`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'Time Sheet') {
                  const url = `https://www.nexis365.com/saas/index.php?url=time_sheet.php&id=5198`;
                  navigation.navigate("Webview", { url });
                }
                if (option.title === 'My Profile') {
                  const url = `https://www.nexis365.com/saas/index.php?url=my_profile.php&id=5173`;
                  navigation.navigate("Webview", { url });
                }
              }}
            >
              <components.Image
                source={option.icon}
                style={{
                  width: responsiveWidth(iconResponse),
                  height: responsiveWidth(iconResponse),
                }}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: theme === 'dark' ? '#fff' : '#000',
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

   const TimeSheet = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const { theme } = useTheme();
  
    useEffect(() => {
      fetchAttendanceData();
    }, []);
  
    const fetchAttendanceData = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/get-jobs", {
          params: { ref_db, userid, filter: "completed" },
        });
  
        if (response.data.success) {
          setAttendanceData(response.data.jobs);
        } else {
          setAttendanceData([]);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
  
    const calculateTotalTime = (clockIn, clockOut) => {
      if (!clockIn || !clockOut) return "N/A";
      const duration = moment.duration(moment.unix(clockOut).diff(moment.unix(clockIn)));
      return `${duration.hours()}h ${duration.minutes()}m`;
    };
  
    const styles = StyleSheet.create({
      container: { flex: 1, backgroundColor: theme === "dark" ? "#333" : "#fff", padding: 16, },
      title: { fontSize: 22, fontWeight: "bold", marginVertical: 10, color: theme === "dark" ? "#fff" : "#757575" },
      card: { backgroundColor: "#f9f9f9", padding: 8, borderRadius: 10, marginBottom: 8, elevation: 2 },
      row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, },
      label: { fontSize: 16, fontWeight: "bold", color: "#757575", flex: 1, textAlign: 'justify' },
      value: { fontSize: 16, color: "#555", flex: 1, textAlign: 'justify'  },
    });
    
  
    return (
      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 20, marginBottom:10, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333',}}>TimeSheet</Text>
  
        <View style={{marginBottom:120}} >
        {attendanceData.slice(0, 10).map((item, index) => {
          const clockInTimestamp = item.clockin ? moment.unix(item.clockin).tz("Australia/Sydney") : null;
          const clockOutTimestamp = item.clockout ? moment.unix(item.clockout).tz("Australia/Sydney") : null;
  
          const clockInTime = clockInTimestamp ? clockInTimestamp.format("HH:mm:ss") : "N/A";
          const clockOutTime = clockOutTimestamp ? clockOutTimestamp.format("HH:mm:ss") : "N/A";
          const totalTime = calculateTotalTime(item.clockin, item.clockout);
          return (
            <View key={index} style={styles.card}>
              <View style={{ flex: 1}}>
                <View style={styles.row}>
                  <Text style={styles.label}>Clock In</Text>
                  <Text style={styles.label}>Clock Out</Text>
                  <Text style={styles.label}>Total Time</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.value}>{clockInTime}</Text>
                  <Text style={styles.value}>{clockOutTime}</Text>
                  <Text style={styles.value}>{totalTime}</Text>
                </View>
              </View>
            </View>
          );
        })}
        </View>
      </ScrollView>
    );
    };

  return (
    <View style={{flex: 1,   backgroundColor: theme === 'dark' ? '#333' : '#fff',}}>
      {/* {renderHeader()} */}
      {/* {renderContent()} */}
      {TimeSheet()}
    </View>
  );
};

export default Timesheet;
