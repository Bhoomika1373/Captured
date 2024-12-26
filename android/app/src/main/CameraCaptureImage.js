import React, { useState, useRef } from 'react';
import { View, Button, Text, Image, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import Mailer from 'react-native-mail';

const CameraView = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  // Capture image from camera
  const captureImage = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setImage(data.uri);
    }
  };

  // Send image to Clarifai API
  const sendClarifaiRequest = async (imageData) => {
    setLoading(true);
    const apiKey = 'YOUR_CLARIFAI_API_KEY';

    try {
      const response = await axios.post(
        'https://api.clarifai.com/v2/models/demographics/outputs',
        {
          inputs: [
            {
              data: {
                image: {
                  base64: imageData.split(',')[1], // Remove the data URL prefix
                },
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Clarifai response:', response.data);
    } catch (error) {
      console.error('Error with Clarifai API:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send email with image attachment
  const sendEmail = (imageData) => {
    Mailer.mail(
      {
        subject: 'Thief Detected',
        recipients: ['anuragsidana22@gmail.com'],
        body: 'See the attached image.',
        isHTML: true,
        attachment: {
          path: imageData,
          type: 'jpg',
          name: 'captured_image.jpg',
        },
      },
      (error, event) => {
        if (error) {
          console.error('Error sending email', error);
        } else {
          console.log('Email sent', event);
        }
      }
    );
  };

  // Handle image capture and processing
  const handleCapture = async () => {
    if (!image) {
      alert('Please capture an image first.');
      return;
    }

    // Process the image (e.g., send to Clarifai, send email)
    sendClarifaiRequest(image);
    sendEmail(image);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Camera View</Text>
      <RNCamera
        ref={cameraRef}
        style={{ width: 300, height: 300, marginBottom: 20 }}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
      />
      <Button title="Capture Image" onPress={captureImage} />
      {image && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>Preview:</Text>
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
        </View>
      )}
      <Button title={loading ? 'Processing...' : 'Process Image'} onPress={handleCapture} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
    </View>
  );
};

export default CameraView;
