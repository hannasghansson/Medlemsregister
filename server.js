import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
const port = 3000;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('memberDb');
const memberCollection = db.collection('memberColl');

// Rendera ut startsidan
app.get('/startpage', (req, res) => {
  res.render('startpage');
});



// skapar en ny route för skapa inlogging
app.get('/create', (req, res) => {
  res.render('create');
});

app.get('/create', async (req, res) => {
  const member = await memberCollection.find({}).toArray();
  res.render('create', {
    member
  });
});


app.post('/create', async (req, res) => {
  await memberCollection.insertOne({
    ...req.body,
    createdAccount: new Date()
  });
  res.redirect('/memberList');
});

// Skapar en rout för memberpages
app.get('/memberPage/:id', async (req, res) => {
  const member = await memberCollection.findOne({_id: ObjectId(req.params.id)});
  res.render('memberPage', member)
});

// Delete
app.post('/delete/:id', async (req, res) => {
  await memberCollection.deleteOne({_id: ObjectId(req.params.id)});
  res.redirect('/memberList');
});

// ändar info

app.get('/edit/:id', async (req, res) => {
  const member = await memberCollection.findOne({_id: ObjectId(req.params.id)});
  res.render('edit', member);
});

app.post('/edit/:id', async (req, res) => {
  await memberCollection.updateOne(
    {_id: ObjectId(req.params.id)},
    { $set: req.body }
  );
  res.redirect('/memberList');
});

// Sortera 
// Skriver ut medlemar i listan
app.get('/memberList', async (req, res) => {
  const members = await memberCollection.find({}).toArray();
  res.render('memberList', {
    members
  });
});

app.get('/memberPage/sort/a', async(req, res) =>{
  const members = await memberCollection.find({}).sort({name: 1}).toArray();
  res.render('memberList', {
    members
  });
})

app.get('/memberPage/sort/b', async(req, res) =>{
  const members = await memberCollection.find({}).sort({name: -1}).toArray();
  res.render('memberList', {
    members
  });
})


app.listen(port, () => console.log(`Listening on ${port}`));