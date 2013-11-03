var
  $codeField,// To be used in app.enter
  app = require('derby').createApp(module);

app
  .use(require('derby-ui-boot'))
  .use(require('../../ui'));


// ROUTES //

// Derby routes are rendered on the client and the server
app.get('/', function(page) {
  page.render('home');
});

app.get('/list', function(page, model, params, next) {
  // This value is set on the server in the `createUserId` middleware
  var userId = model.get('_session.userId');

  // Create a scoped model, which sets the base path for all model methods
  var user = model.at('users.' + userId);

  // Create a mongo query that gets the current user's items
  var itemsQuery = model.query('items', {userId: userId});

  // Get the inital data and subscribe to any updates
  model.subscribe(user, itemsQuery, function(err) {
    if (err) return next(err);

    // Create references that can be used in templates or controller methods
    model.ref('_page.user', user);
    itemsQuery.ref('_page.items');

    user.increment('visits');
    page.render('list');
  });
});

app.enter( '/list', function(model) {

  /////////////////////////////////////////
  // Applying Ace editor to each code field
  /////////////////////////////////////////

  $codeField = $('.codeField'); // Each instance of this element contains a generic editor
                                // and a placeholder for the Ace editor.
                                // $codeField is declared as a global var in the beginning of this file.

  $codeField.each( function() {
    var
      $currentCodeField = $(this),
      $genericEditor = $currentCodeField.find('.codeField-generic'), // Looking up the normal editor
      $aceEditor = $currentCodeField.find('.codeField-rich'); // Looking up an element that will become Ace editor

    $genericEditor.hide(); // Hiding the normal editor
    $currentCodeField.ace = ace.edit($aceEditor[0]); // Creating Ace editor within designated element and storing the object

    // Whenever text from Ace editor is modified, copy it to the normal editor
    $currentCodeField.ace.getSession().on('change', function(e) {
      var textFromRealEditor = $currentCodeField.ace.getValue(); // Getting text from the Ace editor
      model.set('_page.newItem.code', textFromRealEditor); // Placing the text into normal editor
    });
  });

});


// CONTROLLER FUNCTIONS //

app.fn('list.add', function(e, el) {
  var newItem = this.model.del('_page.newItem');
  if (!newItem) return;
  newItem.userId = this.model.get('_session.userId');
  this.model.add('items', newItem);
});

app.fn('list.remove', function(e) {
  var item = e.get(':item');
  this.model.del('items.' + item.id);
});
