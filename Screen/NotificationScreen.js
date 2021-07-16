import React, {useEffect, useState, useRef} from 'react';

import {
  ScrollView,
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Linking,
  Text,
  Button,
  Touchableopacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {
  teleconsultation_handler,
  appointmentbooked_handler,
} from '../Notification.js';
import {DeviceEventEmitter} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

var RNFS = require('react-native-fs');

import BackgroundTimer from 'react-native-background-timer';

var acknowledgement, replace_brackets;

let intervalID;

import TcpSocket from 'react-native-tcp-socket';

import {useFocusEffect} from '@react-navigation/native';

const NotificationScreen = ({navigation}) => {
  let pressed = false;
  const [message, setmessage] = useState('');
  const [url, seturl] = useState('');
  const [view, setview] = useState('');
  const [msgid, setmsgid] = useState('');
  let interval = useRef();

  useFocusEffect(
    React.useCallback(() => {
      onStart();
      const subscription = DeviceEventEmitter.addListener(
        'notificationClickHandle',
        function (e) {
          console.log('json', e);
        },
      );
      return () => {
        onStop();
        subscription.remove();
      };
    }, []),
  );

  const hello = async () => {
    try {
      var date = new Date().toLocaleString();
      console.log('------------' + date + ' -------------');
      let client = TcpSocket.createConnection(
        {port: 9000, host: 'localhost'},
        () => {
          // 'SELECT * FROM inbox ORDER BY MessageId DESC LIMIT 1 ;',
          client.write(
            JSON.stringify({
              query5: 'SELECT * FROM  inbox  where MessageStatus="n" LIMIT 1;',
            }),
          );
        },
      );
      // client.on('connect', () => {
      //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
      // });
      client.on('data', data => {
        console.log(
          'message was received from INBOX TABLE==>',
          data.toString(),
        );
        let var1 = data.toString();
        setview(var1);
        let replace = var1.replace('[', '').replace(']', '');
        if (replace) {
          displaymessage(replace);
        }
        client.end();
      });
      client.on('error', error => {
        console.log(error);
        client.end();
      });
      client.on('close', () => {
        console.log('Connection closed!');
        client.end();
      });
    } catch (e) {
      console.log('error: ' + e);
    }
  };

  async function displaymessage(replace) {
    let localvar = JSON.parse(replace);

    const read = await AsyncStorage.getItem('registration');
    let parse = JSON.parse(read);

    if (localvar.MessageText) {
      let splitted_msg, splitted_url;
      if (localvar.MessageText.includes('$')) {
        splitted_url = localvar.MessageText.split('$').pop();
        splitted_msg = localvar.MessageText.substring(
          0,
          localvar.MessageText.indexOf('$'),
        );
      } else {
        splitted_msg = localvar.MessageText;
        splitted_url = null;
      }
      setmessage(splitted_msg);
      seturl(splitted_url);
      setmsgid(localvar.MessageId);
      console.log('-----------------');
      console.log('MESSAGE===> ', splitted_msg);
      console.log('URL==> ', splitted_url);
      switch (localvar.EventName) {
        case 'Appointment_BooKed':
          appointmentbooked_handler(localvar.EventName, splitted_msg);
          let client = TcpSocket.createConnection(
            {port: 9000, host: 'localhost'},
            () => {
              // 'SELECT * FROM inbox ORDER BY MessageId DESC LIMIT 1 ;',
              console.log(localvar.MessageId);
              client.write(
                JSON.stringify({
                  query7: `UPDATE inbox set MessageStatus=? 
                   WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
                  AND MessageId=?`,
                  status: 'shown',
                  application: parse.application,
                  key: parse.key,
                  messageid: localvar.MessageId,
                }),
              );
            },
          );
          // client.on('connect', () => {
          //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
          // });
          client.on('data', data => {
            console.log(
              'message was received from server ==>',
              data.toString(),
            );
            client.end();
          });
          client.on('error', error => {
            console.log(error);
            client.end();
          });
          client.on('close', () => {
            console.log('Connection closed!');
            client.end();
          });
          break;

        case 'Tele_Consultation':
          teleconsultation_handler(localvar.EventName, splitted_msg);
          client = TcpSocket.createConnection(
            {port: 9000, host: 'localhost'},
            () => {
              // 'SELECT * FROM inbox ORDER BY MessageId DESC LIMIT 1 ;',
              console.log(localvar.MessageId);
              client.write(
                JSON.stringify({
                  query7: `UPDATE inbox set MessageStatus=? 
                   WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
                  AND MessageId=?`,
                  status: 'shown',
                  application: parse.application,
                  key: parse.key,
                  messageid: localvar.MessageId,
                }),
              );
            },
          );
          // client.on('connect', () => {
          //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
          // });
          client.on('data', data => {
            console.log(
              'message was received from server ==>',
              data.toString(),
            );
            client.end();
          });
          client.on('error', error => {
            console.log(error);
            client.end();
          });
          client.on('close', () => {
            console.log('Connection closed!');
            client.end();
          });
          break;
        case 'Test':
          teleconsultation_handler(localvar.EventName, splitted_msg);
          client = TcpSocket.createConnection(
            {port: 9000, host: 'localhost'},
            () => {
              // 'SELECT * FROM inbox ORDER BY MessageId DESC LIMIT 1 ;',
              console.log(localvar.MessageId);
              client.write(
                JSON.stringify({
                  query7: `UPDATE inbox set MessageStatus=? 
                   WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
                  AND MessageId=?`,
                  status: 'shown',
                  application: parse.application,
                  key: parse.key,
                  messageid: localvar.MessageId,
                }),
              );
            },
          );
          // client.on('connect', () => {
          //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
          // });
          client.on('data', data => {
            console.log(
              'message was received from server ==>',
              data.toString(),
            );
            client.end();
          });
          client.on('error', error => {
            console.log(error);
            client.end();
          });
          client.on('close', () => {
            console.log('Connection closed!');
            client.end();
          });
          break;

        case 'default':
          break;
      }
    }
  }
  const onStart = () => {
    // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
    if (ReactNativeForegroundService.is_task_running()) {
      return;
    }
    // Creating a task.
    ReactNativeForegroundService.add_task(() => hello(), {
      delay: 30000,
      onLoop: true,
      taskId: '03',
      onError: e => console.log(`Error logging:`, e),
    });
    // starting  foreground service.
    return ReactNativeForegroundService.start({
      id: 1,
      title: 'client2',
      message: 'your app is running',
    });
  };

  const onStop = () => {
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running('03')) {
      ReactNativeForegroundService.remove_task('03');
    }
    // Stoping Foreground service.
    return ReactNativeForegroundService.stop({id: 1});
  };

  async function gotourl() {
    const read1 = await AsyncStorage.getItem('registration');
    let parse1 = JSON.parse(read1);
    // if (!pressed) {
    pressed = true;
    console.log('url meeting===> ', url);
    if (url) {
      Linking.openURL(url);
    }
    let client = TcpSocket.createConnection(
      {port: 9000, host: 'localhost'},
      () => {
        console.log(msgid);
        client.write(
          JSON.stringify({
            query7: `UPDATE inbox set response=? 
               WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
              AND MessageId=?`,
            status: 'accepted',
            messageid: msgid,
            application: parse1.application,
            key: parse1.key,
          }),
        );
      },
    );
    client.on('data', data => {
      console.log('message was received from server ==>', data.toString());
      client.end();
    });
    client.on('error', error => {
      console.log(error);
      client.end();
    });
    client.on('close', () => {
      console.log('Connection closed!');
      client.end();
    });

    // } else {
    //   alert('System has already acknowledged');
    // }
  }

  async function deleteItem() {
    const read2 = await AsyncStorage.getItem('registration');
    let parse2 = JSON.parse(read2);

    let client = TcpSocket.createConnection(
      {port: 9000, host: 'localhost'},
      () => {
        client.write(
          JSON.stringify({
            query7: `UPDATE inbox set response=? 
               WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
              AND MessageId=?`,
            application: parse2.application,
            key: parse2.key,
            status: 'rejected',
            messageid: msgid,
          }),
        );
      },
    );
    // client.on('connect', () => {
    //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
    // });
    client.on('data', data => {
      console.log('message was received from server ==>', data.toString());
      client.end();
    });
    client.on('error', error => {
      console.log(error);
      client.end();
    });
    client.on('close', () => {
      console.log('Connection closed!');
      client.end();
    });
    // if (!pressed) {
    //   pressed = true;
    // } else {
    //   alert('System has already acknowledged');
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>client 2 </Text>
      {view.length <= 3 ? (
        <>
          <Text style={styles.heading}>NO NEW MESSAGES</Text>
        </>
      ) : (
        <>
          <Text style={styles.textStyle}>{message}</Text>
          <Button onPress={() => gotourl()} title="Accept" color="green" />
          <Button onPress={() => deleteItem()} title="Delete" color="red" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e58',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginVertical: 15,
    marginHorizontal: 5,
  },
  actionButton: {
    marginLeft: 5,
  },
  seasonName: {
    color: '#fdcb9e',
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 0,
    marginBottom: 20,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});

export default NotificationScreen;
