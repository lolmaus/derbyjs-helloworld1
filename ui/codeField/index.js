exports.init = function(model) {

}

exports.create = function(model, dom) {
  var el = dom.element('ace');
  var editor = ace.edit(el);

  editor.getSession().on('change', function(e) {
    console.log('editor', editor.getValue());
    var value = editor.getValue();
    model.pass({message: 'self-induced'}).set('value', value);

  });

  model.on('change', 'value', function(value, previous, pass) {
    console.log('model', editor.getValue());
    if (pass.message !== 'self-induced') {
      editor.setValue(value);
    }
  });
}