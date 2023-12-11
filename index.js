import express from "express";

import QRCode from "qrcode-svg-ts";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let mylink;


app.use(bodyParser.urlencoded({ extended: true }));


function getlink(req,res,next){
    mylink = req.body["password"];
    var qrcode = new QRCode({
        content: String(mylink),
        padding: 0,
        width: 256,
        height: 256,
        color: "#A29100",
        background: "#FF00DC",
        ecl: "M",
      });

      var dataURL = qrcode.toDataURL();

      qrcode.save("simple.svg").then(() => {
        console.log(mylink);
        console.log('保存成功');
    }).catch(console.err)
    next();
}

app.use(getlink);

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.use(express.static('public'));

  app.post("/check", (req, res) => {
    res.sendFile(__dirname+"/qr.html");
    //res.render("index.ejs");
    //res.send(`<img src="/back-end/QR code generator/index.html" alt="">`);
    //res.sendFile(__dirname + "/URL.txt");
    //res.sendFile(__dirname + "/simple.svg");
    fs.writeFile("URL.txt", String(mylink), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  });
  

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  });

