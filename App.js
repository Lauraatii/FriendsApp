import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "../FriendApp/firebaseConfig";
import Signup from './src/screens/Signup';
import SignIn from './src/screens/Signin';
import Namescreen from "./src/screens/Onboarding Screens/Namescreen";
import GenderScreen from './src/screens/Onboarding Screens/GenderScreen';
import BirthdayScreen from './src/screens/Onboarding Screens/BirthdayScreen';
import CountryScreen from './src/screens/Onboarding Screens/CountryScreen';
import ProfilePictureScreen from './src/screens/Onboarding Screens/ProfilePictureScreen';
import MeetingPreferenceScreen from './src/screens/Onboarding Screens/MeetingPreferenceScreen';
import CategoriesScreen from './src/screens/Onboarding Screens/CategoriesScreen';
import LoadingScreen from './src/screens/Onboarding Screens/LoadingScreen';
import MyTabs from "./src/screens/TabNav/Navigator";
import SettingsScreen from './src/Profile/SettingsScreen';
import EditProfile from './src/Profile/EditProfile';
import ProfileScreen from './src/Profile/ProfileScreen';
import HomeScreen from './src/screens/TabNav/HomeScreen';
import CategoryProfiles from './src/screens/CategoryProfiles';
import BioScreen from './src/screens/Onboarding Screens/BioScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="NameScreen" component={Namescreen} />
        <Stack.Screen name="GenderScreen" component={GenderScreen} />
        <Stack.Screen name="BirthdayScreen" component={BirthdayScreen} />
        <Stack.Screen name="CountryScreen" component={CountryScreen} />
        <Stack.Screen name="ProfilePictureScreen" component={ProfilePictureScreen} />
        <Stack.Screen name="MeetingPreferenceScreen" component={MeetingPreferenceScreen} />
        <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
        <Stack.Screen name="BioScreen" component={BioScreen} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CategoryProfiles" component={CategoryProfiles} />

        


      </Stack.Navigator>
    </NavigationContainer>
  );
}
