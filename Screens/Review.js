import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import ImageManager from '../Components/ImageManager';
import { db, auth, storage } from '../Firebase/FirebaseSetup';
import { doc, updateDoc, getDoc, where } from 'firebase/firestore';
import { writeReviewToDB } from '../Firebase/ReviewHelper';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { findUserById } from '../Firebase/UserInformation';
import { sendPushNotification } from '../Components/PushNotification';

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

    let finalReviewUri = reviewUri;

    if ( reviewUri && reviewUri.startsWith("file://")) {
      try {
        const uploadUri = await getImageData(reviewUri); 
        finalReviewUri = uploadUri; 
      } catch (error) {
        console.error("Error uploading avatar image:", error);
        Alert.alert("Upload Error", "There was an error uploading your avatar.");
        return; 
      }
    }
  
    const reviewData = {
      text: reviewText,
      rating: starCount,
      imageUrl: finalReviewUri,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    };
  
    try {
      const reviewResult = await writeReviewToDB(taskId, reviewData);
      if (reviewResult.success) {
        const taskRef = doc(db, "taskHistory", taskId);
        const taskSnapshot = await getDoc(taskRef);
        if (taskSnapshot.exists()) {
          const taskData = taskSnapshot.data();
          console.log(taskData.acceptorId);
          const acceptorId = taskData.acceptorId;
    
          const userRef = await findUserById(db, acceptorId); // Getting DocumentReference
          console.log(userRef);
          if (userRef) {
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              const ownerPushToken = userData.pushToken;
              if (ownerPushToken) {
                sendPushNotification(ownerPushToken);
              }
            }
            await updateDoc(taskRef, { hasReview: true });
            Alert.alert('Success', 'Your review has been submitted successfully!');
            navigation.goBack();
          } else {
            console.log("User reference not found");
          }
        } else {
          console.log("Task not found");
        }
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit the review. Please try again later.');
    }}
    

  async function getImageData(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      console.log('imageName:', imageName); 
      console.log('imageRef:', imageRef); 
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log('uploadResult:', uploadResult); 
      const downloadURL = await getDownloadURL(uploadResult.ref); 
      console.log('Download URL:', downloadURL); 
      return downloadURL;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  }

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
      {/* <Button
        title="Submit Review"
        onPress={handleReviewSubmit}
      /> */}
      <PressableArea
              customizedStyle={{  
                marginTop: 50, 
                marginLeft: 100,
                width: 120, 
                height: 40,
                backgroundColor: backgroundColorChoose,
                borderRadius: 5,
                
                }}
              disabled={buttonLabel === 'Not accepted yet' || buttonLabel === 'Accepted'}
              areaPressed={handleReviewSubmit}
              
            >
          <Label
              content="Submit Review"
              customizedStyle={[CommonStyles.normalLabel, {fontSize: 24}]}
                        />
        </PressableArea>
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
