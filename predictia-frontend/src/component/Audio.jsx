import axios from 'axios';
import React, { useState } from 'react'

export const AudioBox = () => {
    const [sentences, setSentences] = useState(["Crocodiles are large reptiles that live in the water."]);

    const handlePlay2 = async (sentence) => {
      const response = await axios.get('https://polly.us-west-2.amazonaws.com/v1/speech', {
        params: {
          Text: sentence,
          OutputFormat: 'mp3',
          VoiceId: 'Joanna',
        },
        responseType: 'arraybuffer',
      });
  
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    };

    const handlePlay3 = (sentence) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 0.70;
      utterance.pitch = 2;
      synth.speak(utterance);
    };

    const handlePlay = (sentence) => {
      const audio = new Audio(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyD5lv5Z9txVwezH3E0jXsGeJHLmo-fYFfQ&text=${sentence}`);
      audio.play();
      axios.post(
        'https://texttospeech.googleapis.com/v1beta1/text:synthesize',
        {
          input: { sentence },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer AIzaSyDOc1MoGzO3-zJodXBreHmeWKyx2JOzCNI`,
          },
        }
      )
        .then(({ data }) => {
          const audio = new Blob([data.audioContent], { type: 'audio/mp3' });
          // setAudio();
          const audioEl = new Audio(URL.createObjectURL(audio));
          audioEl.play();
        });
    };
  
    return (
      <div>
        {sentences.map((sentence) => (
          <div key={sentence}>
            <p>{sentence}</p>
            <button onClick={() => handlePlay(sentence)}>Play</button>
          </div>
        ))}
      </div>
    );
  
}
