import {
  Text,
  SafeAreaView,
  TextInput,
  View,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Alert,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function Home() {
  const [image, setImage] = React.useState(null);
  const [image2, setImage2] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [imageLink, setImageLink] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    handleShowProduct();
  }, []);

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
      setImage2(result);
    }
  };

  const handleShowProduct = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(
        "https://muoireview.tunna.fun/api/get-products"
      );
      setProducts(response.data);
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadProduct = async () => {
    try {
      if (image != null) {
        const fileExtension = image.split(".")[1];
        console.log("fileExtension is " + fileExtension);

        const data = new FormData();

        const fileName = Date.now() + "." + fileExtension;

        data.append("file_attachment", {
          uri: image,
          name: fileName,
          type: `image/${fileExtension}`,
        });

        axios({
          method: "post",
          url: "https://muoireview.tunna.fun/api/upload-image",
          data: data,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then(function (response) {
            //handle success
            console.log(response.data);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });

        const res = await axios.get(
          "https://muoireview.tunna.fun/api/add-product?name=" +
            name +
            "&link=https://tndg.link/api/redirect?next=" +
            link +
            "&image=https://muoireview.tunna.fun/assets/images/" +
            fileName
        );
        console.log(res.data);
      } else {
        const res = await axios.get(
          "https://muoireview.tunna.fun/api/add-product?name=" +
            name +
            "&link=https://tndg.link/api/redirect?next=" +
            link +
            "&image=" +
            imageLink
        );
        console.log(res.data);
      }
    } catch (e) {
      console.log(e);
    }
    handleShowProduct();
  };

  const handleRemoveProduct = async (id) => {
    try {
      const res = await axios.get(
        "https://muoireview.tunna.fun/api/remove-product?id=" + id
      );
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ padding: 15, flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleShowProduct}
          />
        }
      >
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
            onChangeText={(text) => setName(text)}
            text={name}
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
            onChangeText={(text) => setLink(text)}
            text={link}
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
            onChangeText={(text) => setImageLink(text)}
            text={imageLink}
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
          <Button onPress={handleUploadProduct} title="Up sản phẩm" />
        </View>
        <Text
          style={{
            fontWeight: 600,
            fontSize: 20,
            marginTop: 25,
            marginBottom: 10,
          }}
        >
          Sản phẩm của tôi
        </Text>
        <View>
          {products.map((product) => (
            <TouchableOpacity
              key={product.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
              onPress={() => {
                Linking.openURL(product.link);
              }}
              onLongPress={() => {
                Alert.alert(
                  "Lưu ý",
                  "Bạn có chắc chắn muốn xóa sản phẩm này?",
                  [
                    {
                      text: "Không",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Có",
                      onPress: () => {
                        handleRemoveProduct(product.id);
                        handleShowProduct();
                      },
                    },
                  ]
                );
              }}
            >
              <Image
                source={{ uri: product.image }}
                style={{ width: 70, height: 70, marginRight: 10 }}
              ></Image>
              <Text>{product.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
