const router = require('express').Router();
const { Products, Shopper } = require('../models');
const getData = require('../Covid-Latest-Totals');

// GET all products for product page
router.get('/products', async (req, res) => {
  try {
    const dbProductData = await Products.findAll();
    // const dbProductData = await Products.findAll({
    //   include: [
    //     {
    //       model: Products,
    //       attributes: ['filename', 'title', 'description'],
    //     },
    //   ],
    // });

    const products = dbProductData.map((product) =>
      product.get({ plain: true })
    );
    //Send over the 'products' session variable to the 'homepage' template
    res.render('storefront', {
      products,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET products --
router.get('/products/:id', async (req, res) => {
  try {
    const dbProductsData = await Products.findByPk(req.params.id, {
      include: [
        {
          model: Products,
          attributes: [
            'id',
            'title',
            'filename',
            'description',
          ],
        },
      ],
    });

    const Product = dbProductsData.get({ plain: true });
    // Send over the 'loggedIn' session variable to the 'product' template
    res.render('product', { products, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//LINE 32+ 58 have identical routes...

// GET one product
router.get('/products/:id', async (req, res) => {
  try {
    const dbProductsData = await Products.findByPk(req.params.id);

    const products = dbProductsData.get({ plain: true });
    // Send over the 'loggedIn' session variable to the 'homepage' template
    res.render('products', { products, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/products');
    return;
  }
  // Otherwise, render the 'login' template
  getData(([json]) => {
    res.render('login', json);
  });

});

module.exports = router;
