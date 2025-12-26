"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ▼▼▼ データ定義 ▼▼▼

// 0. 京葉線 (既存)
let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

// 1. 将棋のデータ
let shogi_data = [
  { id: 1, date: "2025-12-01", opponent: "田中さん", result: "勝ち", strategy: "矢倉" },
  { id: 2, date: "2025-12-05", opponent: "鈴木さん", result: "負け", strategy: "四間飛車" },
  { id: 3, date: "2025-12-10", opponent: "佐藤さん", result: "勝ち", strategy: "棒銀" }
];

// 2. タイムカードのデータ
let timecard_data = [
  { id: 1, date: "2025-12-20", start: "09:00", end: "18:00", note: "出社" },
  { id: 2, date: "2025-12-21", start: "09:30", end: "19:00", note: "在宅" },
  { id: 3, date: "2025-12-22", start: "10:00", end: "17:00", note: "半休" }
];

// 3. 単語帳のデータ
let wordbook_data = [
  { id: 1, word: "Apple", meaning: "りんご", example: "I like apples." },
  { id: 2, word: "Book", meaning: "本", example: "This is a book." },
  { id: 3, word: "Cat", meaning: "猫", example: "The cat is cute." }
];


app.get("/", (req, res) => {
  res.render("index");
});


// ▼▼▼ ルーティング ▼▼▼

// 京葉線 (既存)
app.get("/keiyo", (req, res) => res.render('db1', { data: station }));
app.get("/keiyo2", (req, res) => res.render('keiyo2', { data: station }));
app.get("/keiyo2/:number", (req, res) => {
  res.render('keiyo2_detail', { data: station[req.params.number] });
});

// ==========================================
// 1. 将棋アプリ (Shogi)
// ==========================================

// 一覧表示
app.get("/shogi", (req, res) => {
  res.render('shogi', { data: shogi_data });
});

// 新規登録画面 (Create) - ※ :number より先に書く！
app.get("/shogi/create", (req, res) => {
  res.render("shogi_create");
});

// 新規登録処理
app.post("/shogi/create", (req, res) => {
  const id = shogi_data.length > 0 ? shogi_data[shogi_data.length - 1].id + 1 : 1;
  shogi_data.push({
    id: id,
    date: req.body.date,
    opponent: req.body.opponent,
    result: req.body.result,
    strategy: req.body.strategy
  });
  res.redirect("/shogi");
});

// 削除処理 (Delete) - ※ :number より先に書く！
app.get("/shogi/delete/:number", (req, res) => {
  const number = req.params.number;
  if (shogi_data[number]) {
      shogi_data.splice(number, 1);
  }
  res.redirect("/shogi");
});

// 編集画面 (Update) - ※ :number より先に書く！
app.get("/shogi/edit/:number", (req, res) => {
  const number = req.params.number;
  const detail = shogi_data[number];
  // ここで number も一緒に渡さないとエラーになります
  res.render("shogi_edit", { data: detail, number: number });
});

// 更新処理
app.post("/shogi/update/:number", (req, res) => {
  const number = req.params.number;
  if (shogi_data[number]) {
      shogi_data[number].date = req.body.date;
      shogi_data[number].opponent = req.body.opponent;
      shogi_data[number].result = req.body.result;
      shogi_data[number].strategy = req.body.strategy;
  }
  res.redirect("/shogi");
});

// 詳細表示 (Read) - ※ 必ず一番最後に書く！
app.get("/shogi/:number", (req, res) => {
  const number = req.params.number;
  const detail = shogi_data[number];
  
  // データが存在しない場合のエラー回避
  if (!detail) {
      return res.redirect("/shogi");
  }
  // ここで number も一緒に渡さないとエラーになります
  res.render('shogi_detail', { data: detail, number: number });
});


// ==========================================
// 2. タイムカードアプリ (Timecard)
// ==========================================

app.get("/timecard", (req, res) => {
  res.render('timecard', { data: timecard_data });
});

app.get("/timecard/create", (req, res) => {
  res.render("timecard_create");
});

app.post("/timecard/create", (req, res) => {
  const id = timecard_data.length > 0 ? timecard_data[timecard_data.length - 1].id + 1 : 1;
  timecard_data.push({
    id: id,
    date: req.body.date,
    start: req.body.start,
    end: req.body.end,
    note: req.body.note
  });
  res.redirect("/timecard");
});

app.get("/timecard/delete/:number", (req, res) => {
  const number = req.params.number;
  if(timecard_data[number]) {
      timecard_data.splice(number, 1);
  }
  res.redirect("/timecard");
});

app.get("/timecard/edit/:number", (req, res) => {
  const number = req.params.number;
  res.render("timecard_edit", { data: timecard_data[number], number: number });
});

app.post("/timecard/update/:number", (req, res) => {
  const number = req.params.number;
  if (timecard_data[number]) {
      timecard_data[number].date = req.body.date;
      timecard_data[number].start = req.body.start;
      timecard_data[number].end = req.body.end;
      timecard_data[number].note = req.body.note;
  }
  res.redirect("/timecard");
});

app.get("/timecard/:number", (req, res) => {
  const number = req.params.number;
  if (!timecard_data[number]) return res.redirect("/timecard");
  res.render('timecard_detail', { data: timecard_data[number], number: number });
});


// ==========================================
// 3. 単語帳アプリ (Wordbook)
// ==========================================

app.get("/wordbook", (req, res) => {
  res.render('wordbook', { data: wordbook_data });
});

app.get("/wordbook/create", (req, res) => {
  res.render("wordbook_create");
});

app.post("/wordbook/create", (req, res) => {
  const id = wordbook_data.length > 0 ? wordbook_data[wordbook_data.length - 1].id + 1 : 1;
  wordbook_data.push({
    id: id,
    word: req.body.word,
    meaning: req.body.meaning,
    example: req.body.example
  });
  res.redirect("/wordbook");
});

app.get("/wordbook/delete/:number", (req, res) => {
  const number = req.params.number;
  if(wordbook_data[number]) {
      wordbook_data.splice(number, 1);
  }
  res.redirect("/wordbook");
});

app.get("/wordbook/edit/:number", (req, res) => {
  const number = req.params.number;
  res.render("wordbook_edit", { data: wordbook_data[number], number: number });
});

app.post("/wordbook/update/:number", (req, res) => {
  const number = req.params.number;
  if(wordbook_data[number]) {
      wordbook_data[number].word = req.body.word;
      wordbook_data[number].meaning = req.body.meaning;
      wordbook_data[number].example = req.body.example;
  }
  res.redirect("/wordbook");
});

app.get("/wordbook/:number", (req, res) => {
  const number = req.params.number;
  if (!wordbook_data[number]) return res.redirect("/wordbook");
  res.render('wordbook_detail', { data: wordbook_data[number], number: number });
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));