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
import {
  downloadFileFromUri,
  openDownloadedFile,
  checkFileIsAvailable,
} from "expo-downloads-manager";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function Home() {
  const [image, setImage] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [imageLink, setImageLink] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [downloadStatus, setDownloadStatus] = React.useState("NOTSTARTED");
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [downloadURL, setDownloadURL] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [uri, setUri] = React.useState("");

  const token = "G7eRpMaa";

  React.useEffect(() => {
    handleShowProduct();
  }, []);

  async function checkAvail() {
    const { isAvailable } = await checkFileIsAvailable(fileName);
    if (isAvailable) {
      setDownloadStatus("FINISHED");
    }
  }

  React.useEffect(() => {
    checkAvail();
  }, [uri]);

  const callback = (downloadProgress) => {
    setDownloadProgress(
      (downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite) *
        100
    );
  };

  const handleDownloadVideo = async () => {
    try {
      if (downloadURL == "") {
        Alert.alert("Vui lòng nhập link video TikTok");
        return;
      }

      if (fileName == "") {
        Alert.alert("Vui lòng nhập tên file video");
        return;
      }

      const regex = /<source src="(.*?)"/g;
      const response = await axios.get(
        "https://dlpanda.com?url=" + downloadURL + "&token=" + token
      );
      const uri = "http:" + regex.exec(response.data)[1];
      setUri(uri);
      const { status, error } = await downloadFileFromUri(
        uri,
        fileName,
        callback
      );
      setDownloadStatus("DOWNLOADING");
      switch (status) {
        case "finished":
          setDownloadStatus("FINISHED");
          Alert.alert("Tải video thành công");
          break;
        case "error":
          setDownloadStatus("ERROR");
          Alert.alert("Tải video thất bại");
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("Download status: " + status);
  };

  // Call this function when you want to generate a new file name
  const generateFileName = () => {
    const newFileName = "video" + getRandomInt(10000) + ".mp4";
    setFileName(newFileName);
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

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
            "&link=" +
            link +
            "&image=https://muoireview.tunna.fun/assets/images/" +
            fileName
        );
        console.log(res.data);
      } else {
        const res = await axios.get(
          "https://muoireview.tunna.fun/api/add-product?name=" +
            name +
            "&link=" +
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
        <View
          style={{
            width: 350,
            height: 40,
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{
              borderWidth: 1,
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
              marginRight: 10,
            }}
            placeholder="Nhập link video TikTok cần tải"
            onChangeText={(text) => setDownloadURL(text)}
            text={downloadURL}
          ></TextInput>
          <AnimatedCircularProgress
            size={40}
            width={3}
            fill={downloadProgress}
            tintColor="blue"
            backgroundColor="#f3f3f3"
            rotation={0}
          >
            {(fill) => (
              <TouchableOpacity
                onPress={handleDownloadVideo}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  backgroundColor: "skyblue",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "blue" }}>Tải</Text>
              </TouchableOpacity>
            )}
          </AnimatedCircularProgress>
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
            placeholder="Nhập tên file video"
            onChangeText={(text) => setFileName(text)}
            text={fileName}
            value={fileName}
          ></TextInput>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={generateFileName}
            title="Tạo tên file video ngẫu nhiên"
          />
        </View>
        <View style={{ marginTop: 20, marginBottom: 10 }}>
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
        <View style={{ marginTop: 20 }}>
          <Button
            onPress={async () => {
              await openDownloadedFile(fileName);
            }}
            title="Mở video"
          />
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
