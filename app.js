const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('express/lib/response');

//express app
const app = express();

//connect to mongodb
const dbURI = "mongodb+srv://jeevika:Jeevika%402001@cluster0.c2li4tc.mongodb.net/learnNode?retryWrites=true&w=majority";
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//using morgan and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));  //to get the data from form
app.use(morgan('dev'));

//adding data to db
app.get('/add-blog', (req, res ) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: 'about my new blog',
        body: 'more about my blog'
    });
    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
})

app.get('/add-blog1', (req, res ) => {
    const blog1 = new Blog({
        title: 'college life',
        snippet: 'about my college',
        body: 'more about my college'
    });
    blog1.save()
        .then((result1) => {
            res.send(result1);
        })
        .catch((err1) => console.log(err1));
})

//responding to request
app.get('/', (req, res) => {
    res.redirect('/blogs');
})
app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
})

//redirect
app.get('/about', (req, res) => {
    res.redirect('/about', {title: 'About'});
})

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1 })
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result});
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
 });

 app.get('blogs/:id', (req, res) => {
     const id = req.params.id;
     Blog.findById(id)
        .then(result => {
            res.render('details', {blog: result, title: 'Blog details'});
        })
        .catch(err => {
            console.log(err);
        });
 });

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'});     //cannot use only redirect bcs this is an ajax req
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', {title: 'Create'});
})

//404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})