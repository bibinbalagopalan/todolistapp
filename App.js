import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [showAddModal, setShowAddModal] = useState(false);

  const priorities = ['high', 'medium', 'low'];
  const categories = ['personal', 'work', 'shopping', 'health'];

  const addTask = () => {
    if (task.trim().length > 0) {
      setTasks([...tasks, { 
        id: Math.random().toString(), 
        text: task,
        date: date.toISOString(),
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      }]);
      setTask('');
      setShowAddModal(false);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(item => 
      item.id === taskId 
        ? { ...item, completed: !item.completed }
        : item
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((item) => item.id !== taskId));
  };

  const filteredTasks = tasks
    .filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.completed === b.completed) {
        if (a.priority === b.priority) {
          return new Date(a.date) - new Date(b.date);
        }
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      }
      return a.completed ? 1 : -1;
    });

  const renderAddTaskModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          
          <TextInput
            style={styles.modalInput}
            placeholder="Task description..."
            value={task}
            onChangeText={setTask}
          />

          <Text style={styles.labelText}>Priority:</Text>
          <View style={styles.optionsContainer}>
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.optionButton,
                  selectedPriority === priority && styles.selectedOption,
                  { backgroundColor: priority === 'high' ? '#ff4444' : 
                                   priority === 'medium' ? '#ffbb33' : '#00C851' }
                ]}
                onPress={() => setSelectedPriority(priority)}
              >
                <Text style={styles.optionText}>{priority}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.labelText}>Category:</Text>
          <View style={styles.optionsContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.optionButton,
                  selectedCategory === category && styles.selectedOption
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.optionText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Due Date: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.addButton]}
              onPress={addTask}
            >
              <Text style={styles.modalButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Todo List</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
        </View>

        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addTaskButtonText}>+ Create New Task</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredTasks}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.taskContainer,
                item.completed && styles.completedTask
              ]}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <View style={styles.taskInfo}>
                <View style={styles.taskHeader}>
                  <Text style={[
                    styles.taskText,
                    item.completed && styles.completedTaskText
                  ]}>
                    {item.text}
                  </Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: item.priority === 'high' ? '#ff4444' : 
                                    item.priority === 'medium' ? '#ffbb33' : '#00C851' }
                  ]}>
                    <Text style={styles.priorityText}>{item.priority}</Text>
                  </View>
                </View>
                <View style={styles.taskFooter}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <Text style={styles.dateText}>
                    Due: {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks found</Text>
            </View>
          )}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {renderAddTaskModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderRadius: 15,
  },
  addTaskButton: {
    backgroundColor: '#3498DB',
    padding: 18,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    gap: 15,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 5,
  },
  taskInfo: {
    flex: 1,
    marginRight: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 17,
    color: '#2C3E50',
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  categoryText: {
    fontSize: 13,
    color: '#7F8C8D',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2C3E50',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2C3E50',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3498DB',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateButton: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  addButton: {
    backgroundColor: '#3498DB',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;