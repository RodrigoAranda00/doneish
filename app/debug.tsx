import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, PASTEL_COLORS } from '../theme';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Button } from '../src/components/Button';
import { listsStorageManager } from '../src/features/lists/storage/listsStorage';
import { useListsContext } from '../src/features/lists/context/ListsContext';
import { useSupermarketContext } from '../src/features/supermarket/context/SupermarketContext';

const GROCERY_ITEMS = [
  'Milk', 'Bread', 'Eggs', 'Butter', 'Cheese', 'Yogurt', 'Apples', 'Bananas',
  'Oranges', 'Tomatoes', 'Lettuce', 'Carrots', 'Onions', 'Potatoes', 'Rice',
  'Pasta', 'Chicken', 'Beef', 'Fish', 'Cereal', 'Coffee', 'Tea', 'Sugar',
  'Flour', 'Oil', 'Salt', 'Pepper', 'Garlic', 'Ginger', 'Broccoli', 'Spinach',
  'Cucumber', 'Bell Peppers', 'Mushrooms', 'Avocado', 'Strawberries', 'Grapes',
  'Watermelon', 'Pineapple', 'Mango', 'Lemon', 'Lime', 'Chips', 'Cookies',
  'Chocolate', 'Ice Cream', 'Juice', 'Soda', 'Water Bottles', 'Paper Towels'
];

const TODO_TASKS = [
  'Call dentist', 'Buy birthday gift', 'Pay electricity bill', 'Clean garage',
  'Schedule car service', 'Water plants', 'Prepare presentation', 'Reply to emails',
  'Book flight tickets', 'Renew gym membership', 'Fix leaky faucet', 'Organize closet',
  'Submit report', 'Plan weekend trip', 'Update resume', 'Meal prep for week',
  'Change air filter', 'Backup phone data', 'Send thank you notes', 'Review budget',
  'Schedule dentist appointment', 'Return library books', 'Vacuum living room',
  'Wash car', 'Buy groceries', 'Call mom', 'Clean bathroom', 'Do laundry',
  'Mow lawn', 'Pick up dry cleaning', 'Feed pets', 'Take out trash',
  'Check tire pressure', 'Replace smoke detector batteries', 'File taxes',
  'Update insurance', 'Paint bedroom', 'Install shelves', 'Repair fence',
  'Trim hedges', 'Clean gutters', 'Service HVAC', 'Test fire alarms',
  'Reorganize pantry', 'Clean refrigerator', 'Dust furniture', 'Wipe windows',
  'Polish silverware', 'Iron clothes', 'Sort mail', 'Shred old documents'
];

export default function DebugScreen() {
  const [storageData, setStorageData] = useState<string>('');
  const [storageSize, setStorageSize] = useState<number>(0);

  const { lists, createList, addItem: addListItem } = useListsContext();
  const { addItem: addSupermarketItem } = useSupermarketContext();

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const rawData = await listsStorageManager.getRawData();
      if (rawData) {
        setStorageData(rawData);
        setStorageSize(new Blob([rawData]).size);
      } else {
        setStorageData('No data stored');
        setStorageSize(0);
      }
    } catch (error) {
      setStorageData('Error loading data');
      console.error('[Debug] Failed to load storage data:', error);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all stored data? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStorageData('No data stored');
              setStorageSize(0);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
              console.error('[Debug] Failed to clear data:', error);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    loadStorageData();
  };

  const handleAddRandomListItems = () => {
    try {
      let targetList = lists.find(list => !list.pinned);

      if (!targetList) {
        const colors = Object.values(PASTEL_COLORS);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        targetList = createList({
          name: 'Debug List',
          emoji: '🐛',
          color: randomColor,
          pinned: false,
        });
      }

      if (targetList) {
        const shuffled = [...TODO_TASKS].sort(() => Math.random() - 0.5);
        const items = shuffled.slice(0, 20);

        items.forEach((task) => {
          addListItem(targetList!.id, task);
        });

        Alert.alert('Success', `Added 20 random tasks to "${targetList.name}"`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add random list items');
      console.error('[Debug] Failed to add random list items:', error);
    }
  };

  const handleAddRandomSupermarketItems = () => {
    try {
      const shuffled = [...GROCERY_ITEMS].sort(() => Math.random() - 0.5);
      const items = shuffled.slice(0, 20);

      items.forEach((itemName) => {
        const price = Math.random() > 0.3
          ? Math.round((Math.random() * 30 + 1) * 100) / 100
          : undefined;

        addSupermarketItem({ name: itemName, price });
      });

      Alert.alert('Success', 'Added 20 random items to supermarket list');
    } catch (error) {
      Alert.alert('Error', 'Failed to add random supermarket items');
      console.error('[Debug] Failed to add random supermarket items:', error);
    }
  };

  if (!__DEV__) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Debug',
            headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
            headerTintColor: COLORS.EIGENGRAU,
          }}
        />
        <ScreenContainer>
          <View style={styles.centeredContainer}>
            <Text style={styles.warningText}>
              Debug screen is only available in development mode
            </Text>
          </View>
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Debug Tools',
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <ScreenContainer>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage Information</Text>
            <Text style={styles.infoText}>
              Size: {(storageSize / 1024).toFixed(2)} KB
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Raw Storage Data</Text>
            <ScrollView
              horizontal
              style={styles.dataContainer}
              showsHorizontalScrollIndicator={true}
            >
              <Text style={styles.dataText}>{storageData}</Text>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Test Data</Text>
            <View style={styles.buttonGroup}>
              <Button
                title="Add 20 List Items"
                onPress={handleAddRandomListItems}
                variant="secondary"
              />
            </View>
            <View style={styles.buttonGroup}>
              <Button
                title="Add 20 Supermarket Items"
                onPress={handleAddRandomSupermarketItems}
                variant="secondary"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Button
              title="Refresh Data"
              onPress={handleRefresh}
              variant="secondary"
            />
          </View>

          <View style={styles.section}>
            <Button
              title="Clear All Data"
              onPress={handleClearAllData}
              variant="danger"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.helpText}>
              This screen allows you to view and manage stored data during development.
              The Clear All Data button will remove all data from AsyncStorage.
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  buttonGroup: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.EIGENGRAU,
    fontFamily: 'monospace',
  },
  dataContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: SPACING.md,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataText: {
    fontSize: 12,
    color: COLORS.EIGENGRAU,
    fontFamily: 'monospace',
  },
  warningText: {
    fontSize: 16,
    color: COLORS.EIGENGRAU,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
