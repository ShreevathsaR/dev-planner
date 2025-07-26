import { StyleSheet } from "react-native";

export const mkParserStyles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  bullet_list:{
    color:"white"
  },
  ordered_list:{
    color: "white"
  },
  code_block:{
    backgroundColor: "#696969",
    color:"lightgray"
  },
  code_inline:{
    backgroundColor: "#696969",
    color:"lightgray"
  },
    fence: {
    backgroundColor: '#1e1e1e',
    color: 'lightgray',
    padding: 10,
    borderRadius: 6,
    borderColor:"#696969"
  },
});
