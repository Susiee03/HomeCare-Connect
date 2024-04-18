import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import ImageManager from '../Components/ImageManager';
import { db, auth } from '../Firebase/FirebaseSetup';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { writeReviewToDB } from '../Firebase/ReviewHelper';

export default function Review({ route, navigation }) {
  const [reviewText, setReviewText] = useState('');
  const [starCount, setStarCount] = useState(3);  // Default rating
  const [reviewUri, setReviewUri] = useState('');
  const taskId = route.params.taskId; // Ensure taskId is passed to this component

  const handleReviewSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert('Not Logged In', 'Please log in to submit a review.');
      return;
    }
  
    const reviewData = {
      text: reviewText,
      rating: starCount,
      imageUrl: reviewUri,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    };
  
    try {
      const reviewResult = await writeReviewToDB(taskId, reviewData);
      if (reviewResult.success) {
        const taskRef = doc(db, "taskHistory", taskId);
        await updateDoc(taskRef, {
          hasReview: true
        });
        Alert.alert('Success', 'Your review has been submitted successfully!');
        navigation.goBack();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit the review. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <ImageManager receiveImageURI={(uri) => setReviewUri(uri)} />
      <Text style={styles.label}>Your Review:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type your review here..."
        value={reviewText}
        onChangeText={setReviewText}
      />
      <Text style={styles.label}>Your Rating:</Text>
      <Rating
        type='star'
        ratingCount={5}
        imageSize={30}
        showRating
        onFinishRating={(rating) => setStarCount(rating)}
        startingValue={starCount}
      />
      <Button
        title="Submit Review"
        onPress={handleReviewSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  }
});
