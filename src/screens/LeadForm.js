// CampaignForm.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import DocumentPicker from 'react-native-document-picker';
import {components} from '../components';
import axios from 'axios'; 

const LeadForm = ({ theme }) => {
  const [userId, setUserId] = useState([]);
  const [refDb, setRefDb] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
   const [userOptions, setUserOptions] = useState([]);
   const [dob, setDob] = useState(new Date());
   const [followUpDate, setFollowUpDate] = useState(new Date());
   const [appointmentDate, setAppointmentDate] = useState(new Date());
   const [targetDate, setTargetDate] = useState(new Date()); 
   const [documentFile, setDocumentFile] = useState(null);
  const [formData, setFormData] = useState({
    leadName: '',
    campaignid:'',
    title:'',
    firstName:'',
    surName:'',
    preferredName:'',
    gender:'',
    coordinator: '',
    plan: '',
    possibility: '',
    opportunity: '',
    username: '',
    username2: '',
    managerid: '',
    preferredName:'',
    gender:'',
    address:'',
    city:'',
    state:'',
    zip:'',
    country:'',
    email:'',
    phone:'',
    billingAddress:'',
    clientStory:'',
    note:'',
    managerid:'',
    addemail:'',
    addphone:'',
    type:'',
    ndis:'', 
    priority: '',
    status:'', 
  }); 

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);

   // Handlers
   const onDobChange = (event, selectedDate) => {
    if (selectedDate) setDob(selectedDate);
    setShowDobPicker(Platform.OS === 'ios');
  };

  const onFollowUpChange = (event, selectedDate) => {
    if (selectedDate) setFollowUpDate(selectedDate);
    setShowFollowUpPicker(Platform.OS === 'ios');
  };

  const onAppointmentChange = (event, selectedDate) => {
    if (selectedDate) setAppointmentDate(selectedDate);
    setShowAppointmentPicker(Platform.OS === 'ios');
  };

  const onTargetChange = (event, selectedDate) => {
    if (selectedDate) setTargetDate(selectedDate);
    setShowTargetPicker(Platform.OS === 'ios');
  };

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all file types
      });
  
      console.log(res);
      setDocumentFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/get-alluser", {
          params: { ref_db, userid },
        });
  
        if (response.data.success) {
          const users = response.data.data;
  
          const options = users.map((item) => ({
            label: `${item.username} ${item.username2}`,
            value: String(item.id),
          }));
  
          setUserOptions([{ label: 'Select Manager', value: '' }, ...options]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

        const handleChange = (field, value) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
        };
        // Fetch userId and ref_db from AsyncStorage
        useEffect(() => {
        const loadUserData = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("secondaryId");
            const storedRefDb = await AsyncStorage.getItem("ref_db");
            setUserId(storedUserId || "");
            setRefDb(storedRefDb || "");
          } catch (error) {
            console.error("Error loading user data:", error);
          }
        };
        loadUserData();
      }, []);

      const handleSubmit = async () => {
        if (!userId || !refDb) {
          Alert.alert("Error", "User ID or Ref DB missing");
          return;
        }
      
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('userid', userId);
        formDataToSubmit.append('ref_db', refDb);
        // formDataToSubmit.append('date', Math.floor(date.getTime() / 1000));
        formDataToSubmit.append('leadName', formData.leadName);
        formDataToSubmit.append('campaignid', formData.campaignid);
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('title', formData.firstName);
        formDataToSubmit.append('surName', formData.surName);
        formDataToSubmit.append('preferredName', formData.preferredName);
        formDataToSubmit.append('gender', formData.gender);
        formDataToSubmit.append('dob', dob);
        formDataToSubmit.append('address', formData.address);
        formDataToSubmit.append('city', formData.city);
        formDataToSubmit.append('state', formData.state);
        formDataToSubmit.append('zip', formData.zip);
        formDataToSubmit.append('country', formData.country);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('phone', formData.phone);
        formDataToSubmit.append('billingAddress', formData.billingAddress);
        formDataToSubmit.append('clientStory', formData.clientStory);
        formDataToSubmit.append('note', formData.note);
        formDataToSubmit.append('managerid', formData.managerid);
        formDataToSubmit.append('addemail', formData.addemail);
        formDataToSubmit.append('addphone', formData.addphone);
        formDataToSubmit.append('type', formData.type);
        formDataToSubmit.append('priority', formData.priority);
        formDataToSubmit.append('ndis', formData.ndis);
        formDataToSubmit.append('followUpDate', followUpDate);
        formDataToSubmit.append('appointmentDate', appointmentDate);
        formDataToSubmit.append('targetDate', targetDate);
        formDataToSubmit.append('status', formData.status);
        
          // Check if documentFile exists and append to form data
    if (documentFile) {
      formDataToSubmit.append('document', {
        uri: documentFile.uri,
        type: documentFile.type,
        name: documentFile.name,
      });
    }
      
        try {
          const response = await axios.post("https://app.nexis365.com/api/leads-form", formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log("Incident data sent:", formDataToSubmit);
      
          if (response.data.success) {
            Alert.alert("Success", "Leads record submitted successfully!");
          } else {
            console.error("Error", "Failed to update LEADS record.");
            Alert.alert("Error", "Failed to submit leads.");
          }
        } catch (error) {
          console.error("Error submitting Leads:", error);
          Alert.alert("Error", "Something went wrong!");
        }
      };
      

  const campaignOptions = campaigns.map((item) => ({
    label: item.campaign_name,
    value: String(item.id),
  }));
  

  return (
    <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
      <Text style={styles.formTitle}>Create Lead</Text>

      <TextInput
        placeholder="Lead Name"
        value={formData.leadName}
        onChangeText={(text) => handleChange('LeadName', text)}
        style={styles.input}
      />

      <components.Dropdown
        items={[{ label: 'Select Campaign', value: '' }, ...campaignOptions]}
        selectedValue={formData.campaignid}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, campaignid: value }))
        }
        style={{ flex: 1, marginBottom: 12 }}
      />

       <components.Dropdown
        items={[
        { label: 'Select Title', value: '' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Miss', value: 'Miss' },
        { label: 'Mx', value: 'Mx' },
        { label: 'Madam', value: 'Madam' },
        { label: 'Sir', value: 'Sir' },
        { label: 'Lady', value: 'Lady' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Rev.', value: 'Rev.' },
        { label: 'Master', value: 'Master' },
        ]}
        selectedValue={formData.title}
        onValueChange={(value) =>
        setFormData((prevData) => ({ ...prevData, title: value }))
        }
        style={{ marginBottom: 12 }}
        />

       <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleChange('FirstName', text)}
        style={styles.input}
      />

       <TextInput
        placeholder="Sur Name"
        value={formData.surName}
        onChangeText={(text) => handleChange('SurName', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Preferred Name"
        value={formData.preferredName}
        onChangeText={(text) => handleChange('PreferredName', text)}
        style={styles.input}
      />
       <components.Dropdown
        items={[
        { label: 'Select Gender', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
        ]}
        selectedValue={formData.gender}
        onValueChange={(value) =>
        setFormData((prevData) => ({ ...prevData, gender: value }))
        }
        style={{ marginBottom: 12 }}
        />
        

      <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#000' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Date of Birth: {dob.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDobPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={onDobChange}
        />
      )}
      <TextInput
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={formData.city}
        onChangeText={(text) => handleChange('city', text)}
        style={styles.input}
      />
       <TextInput
        placeholder="State"
        value={formData.state}
        onChangeText={(text) => handleChange('state', text)}
        style={styles.input}
      />
       <TextInput
        placeholder="Zip"
        value={formData.zip}
        onChangeText={(text) => handleChange('zip', text)}
        style={styles.input}
      />
       <TextInput
        placeholder="Country"
        value={formData.country}
        onChangeText={(text) => handleChange('country', text)}
        style={styles.input}
      />
       <TextInput
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
       <TextInput
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        style={styles.input}
      />

       <TouchableOpacity onPress={handleDocumentPick} style={styles.uploadButton}>
        <Text style={[styles.input, {color: theme === 'dark' ? '#000' : '#000'}]} >Upload File</Text>
        {documentFile && documentFile.name && (
          <Text style={{ marginTop: 10, color: '#000' }}> 
            Selected File: {documentFile.name}
          </Text>
          )}
       </TouchableOpacity>

      <TextInput
        placeholder="Billing Address"
        value={formData.billingAddress}
        onChangeText={(text) => handleChange('billingAddress', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline={true}
        numberOfLines={4}
      />

       <TextInput
        placeholder="Client Story/Enquiry (Note)"
        value={formData.clientStory}
        onChangeText={(text) => handleChange('clientStory', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline={true}
        numberOfLines={4}
      />

       <TextInput
        placeholder="Important Notes for Staff"
        value={formData.note}
        onChangeText={(text) => handleChange('note', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline={true}
        numberOfLines={4}
      />

      
            <components.Dropdown
              items={userOptions}
              selectedValue={formData.managerid}
              onValueChange={(value) => 
                setFormData((prevData) => ({ ...prevData, managerid: value })) 
              }
              style={{ flex: 1, marginBottom: 12 }}
            />

      <TextInput
        placeholder="Additional Email"
        value={formData.addemail}
        onChangeText={(text) => handleChange('addemail', text)} 
        style={styles.input}
      />
       <TextInput
        placeholder="Additional Phone"
        value={formData.addphone}
        onChangeText={(text) => handleChange('addphone', text)}
        style={styles.input}
      />

      <components.Dropdown
        items={[
          { label: 'Select Type', value: '' },
          { label: 'HCP', value: 'HCP' },
          { label: 'CHSP', value: 'CHSP' },
        ]}
        selectedValue={formData.type}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, type: value }))
        }
        style={{ marginBottom: 12 }}
      />


      <components.Dropdown
        items={[
          { label: 'Select Priority', value: '' },
          { label: 'High', value: 'High' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Low', value: 'Low' },
        ]}
        selectedValue={formData.priority}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, priority: value }))
        }
        style={{ marginBottom: 12 }}
      />

      <TextInput
        placeholder="NDIS Number"
        value={formData.ndis}
        onChangeText={(text) => handleChange('ndis', text)}
        style={styles.input}
      />

     <TouchableOpacity onPress={() => setShowFollowUpPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#000' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Follow Up Date: {followUpDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showFollowUpPicker && (
        <DateTimePicker
          value={followUpDate}
          mode="date"
          display="default"
          onChange={onFollowUpChange}
        />
      )}
       {/* Appointment Date */}
       <TouchableOpacity onPress={() => setShowAppointmentPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#000' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Appointment Date: {appointmentDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showAppointmentPicker && (
        <DateTimePicker
          value={appointmentDate}
          mode="date"
          display="default"
          onChange={onAppointmentChange}
        />
      )}

      {/* Target Date */}
      <TouchableOpacity onPress={() => setShowTargetPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#000' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Target Date: {targetDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showTargetPicker && (
        <DateTimePicker
          value={targetDate}
          mode="date"
          display="default"
          onChange={onTargetChange}
        />
      )}

      <components.Dropdown
        items={[
          { label: 'ON', value: '1' },
          { label: 'OFF', value: '0' },
        ]}
        selectedValue={formData.status}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, status: value }))
        }
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeadForm;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
