var svgCaptcha = require("svg-captcha");
const path = require("path");
const fse = require("fs-extra");
const BaseController = require("./base");
class UntilController extends BaseController {
  async captcha() {
    const { ctx } = this;
    var captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 4,
      ignoreChars: "0o1i",
    });
    ctx.response.type = "image/svg+xml";
    ctx.session.captcha = captcha.text;
    ctx.body = captcha.data;
  }

  async upload() {
    //模拟报错
    if(Math.random()<0.2){
      return this.ctx.status = 500
    }
    const { ctx } = this;
    const [file] = ctx.request.files;
    const { hash, name } = ctx.request.body;
    const destDir = path.resolve(__dirname, "../public/" + hash);
    await fse.ensureDir(destDir);
    try {
      await fse.move(file.filepath, destDir + "/" + name);
      this.success({ url: "public/" + hash, boolen: fse.existsSync(destDir) });
    } catch (error) {
      return this.error("failed", -1, { error: error.message });
    }
  }

  async mergefile() {
    const { ctx } = this;
    const { ext, size, hash } = ctx.request.body;
    //文件最终路径
    const filePath = path.resolve(__dirname, "../public/" + hash + "." + ext);
    const dirPath = path.resolve(__dirname, "../public/" + hash);
    const files = fse.readdirSync(dirPath);
    files.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
    let chunks = files.map((chunk) => path.resolve(dirPath, chunk));
    const targetStream = fse.createWriteStream(filePath);
    const readSteam = (chunks) => {
      const path = chunks.shift();
      const readStream = fse.createReadStream(path);
      readStream.pipe(targetStream, { end: false });
      readStream.on("end", () => {
        fse.unlinkSync(path);
        if (chunks.length > 0) {
          readSteam(chunks);
        } else {
          targetStream.close();
          readStream.close();
        }
      });
    };
    readSteam(chunks);
    this.success({
      url: filePath,
    });
    // const pipStream = (chunkPath, writeStream) =>
    //   new Promise((resolve) => {
    //     const readStream = fse.createReadStream(chunkPath);
    //     readStream.on("end", () => {
    //       fse.unlinkSync(chunkPath);
    //       resolve(chunkPath);
    //     });
    //     readStream.pipe(writeStream);
    //   });
    //   console.log(chunks);
    // Promise.all(
    //   chunks.map((chunk, index) => {
    //     pipStream(
    //       chunk,
    //       fse.createWriteStream(filePath, {
    //         start: index * size,
    //         end: (index + 1) * size,
    //       })
    //     );
    //   })
    // )
    //   .then((p1, p2, p3) => {
    //     console.log(p1, p2, p3);
    //   })
    //   .catch((e) => console.log(e));
  }

  async checkfile() {
    const { ctx } = this;
    const { hash, ext } = ctx.request.body;
    const filePath = path.resolve(__dirname, "../public/" + hash + "." + ext);
    const dirPath = path.resolve(__dirname, "../public/" + hash);
    let uploaded = false;
    let uploadedList = [];
    if (fse.existsSync(filePath)) {
      uploaded = true;
    } else {
      uploadedList = fse.existsSync(dirPath)
        ? (await fse.readdir(dirPath)).filter((file) => file != ".")
        : [];
    }

    return this.success({
      uploaded,
      uploadedList,
    });
  }
}

module.exports = UntilController;
