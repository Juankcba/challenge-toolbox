import express from "express";
import api from "../../services/echoServApi.js";
import appApi from "../../services/localApi.js";
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Hello v1 GET API from challenge");
});
router.get("/files/data", async (req, res, next) => {
  try {
    const listOfFileNamesResponse = await appApi.get("/files/list");
    const listOfFilesNames = listOfFileNamesResponse.data.files;
    const promesas = listOfFilesNames.map(async (file) => {
      return await appApi
        .post(`/file/data?fileID=${file}`)
        .then((res) => {
          if (res.status === 200) return res.data;
          return { file: file, lines: [] };
        })
        .catch((e) => {
          return { file: file, lines: [] };
        });
    });
    const resultados = (await Promise.all(promesas)).filter(
      (res) => res.lines.length > 0
    );
    // console.log(
    //   resultados.filter(
    //     (res) =>
    //       res.lines.filter(
    //         (line) => line.number == "" || line.hex == "" || line.text == ""
    //       ).length > 0
    //   )
    // );

    res.json(resultados);
  } catch (error) {
    //console.error(error);
    res.status(500).send("Error formateando la respuesta.");
  }

  // res.json({
  //   file: "file1.csv",
  //   lines: [
  //     {
  //       text: "RgTya",
  //       number: 64075909,
  //       hex: "70ad29aacf0b690b0467fe2b2767f765",
  //     },
  //   ],
  // });
});

router.get("/files/list", (req, res) => {
  api
    .get("/secret/files")
    .then((response) => {
      // handle success
      res.json(response.data);
    })
    .catch((e) => {
      // handle error
      res.status(404);
      res.json(e.response.data);
    });

  // res.json({
  //   file: "file1.csv",
  //   lines: [
  //     {
  //       text: "RgTya",
  //       number: 64075909,
  //       hex: "70ad29aacf0b690b0467fe2b2767f765",
  //     },
  //   ],
  // });
});

router.post("/file/data", (req, res) => {
  const { fileID } = req.query;

  api
    .get(`/secret/file/${fileID}`)
    .then((response) => {
      //convert csv to Json formatted
      const rows = response.data.split("\n");
      const headers = rows[0].split(",");

      let validLines = [];
      //validaciones
      rows.slice(1).forEach((element) => {
        const dataArray = element.split(",");
        if (dataArray.length == headers.length) {
          if (dataArray[1] != "" && dataArray[2] != "" && dataArray[3] != "") {
            validLines.push({
              text: dataArray[1],
              number: dataArray[2],
              hex: dataArray[3],
            });
          }
        }
      });

      res.json({
        file: fileID,
        lines: validLines,
      });
    })
    .catch((e) => {
      // handle error
      res.status(404);
      res.json(e.response.data);
    });
});

export default router;
