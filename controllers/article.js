const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMag = '';
        if(!req.isAuthenticated()) {
            errorMag = 'You should be logged in to make articles!'
        } else if (!articleArgs.title) {
            errorMag = 'Invalid title';
        } else if (!articleArgs.content) {
            errorMag = 'Invalid content!';
        }

        if(errorMag) {
            res.render('article/create', {error: errorMag});
            return;
        }
        articleArgs.author = req.user.id;

        Article.create(articleArgs).then(article => {
            req.user.articles.push(article.id);
            req.user.save(err => {
                if(err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            });
        })
    },
    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            res.render('article/details', article)
        });
    }
}