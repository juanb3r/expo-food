import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'orange',
    },
    text_container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'orange',
    },
    buttonContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      margin: 10,
      flexWrap: 'wrap',
    },
    subtitle: { fontSize: 15, color: 'white' },
    title: { fontSize: 30, color: 'white' },
    subtitle: { fontSize: 20, color: 'white' },
    image: { width: 200, height: 200 },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

export { styles };