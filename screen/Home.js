import {
  Text,
  SafeAreaView,
  TextInput,
  View,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";

export default function Home() {
  const [image, setImage] = React.useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleShowProduct = () => {};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 15, flex: 1 }}>
        <Text style={{ fontWeight: 800, fontSize: 30 }}>Tunna Toolkit</Text>
        <View style={{ width: 300, height: 40, marginTop: 10 }}>
          <TextInput
            style={{
              borderWidth: 1,
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
            }}
            placeholder="Nhập tên sản phẩm"
          ></TextInput>
        </View>
        <View style={{ width: 300, height: 40, marginTop: 10 }}>
          <TextInput
            style={{
              borderWidth: 1,
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
            }}
            placeholder="Nhập link Shopee"
          ></TextInput>
        </View>
        <View style={{ width: 300, height: 40, marginTop: 10 }}>
          <TextInput
            style={{
              borderWidth: 1,
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
            }}
            placeholder="Nhập link ảnh sản phẩm (nếu có)"
          ></TextInput>
        </View>
        <View style={{ marginTop: 25, marginBottom: 10 }}>
          <Button onPress={pickImage} title="Chọn ảnh sản phẩm từ điện thoại" />
        </View>
        {image && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                transform: [{ translateX: 90 }, { translateY: -10 }],
                backgroundColor: "red",
                zIndex: 9,
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: -40,
              }}
              onPress={() => setImage(null)}
            >
              <Text
                style={{
                  transform: [{ translateY: -6 }, { translateX: 1 }],
                  fontSize: 40,
                  color: "white",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={() => {
              alert("You tapped the button!");
            }}
            title="Up sản phẩm"
          />
        </View>
        <Text style={{ fontWeight: 600, fontSize: 20, marginTop: 25 }}>
          Sản phẩm của tôi
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
