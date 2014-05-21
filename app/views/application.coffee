`/* global FastClick */`

applicationView = Ember.View.extend

  didInsertElement: ->
    $ ->

      # Bind FastClick to all elements
      FastClick.attach(document.body)

      # You set up CSS to drop down buttons on hover on desktops. This ensures
      # that clicks on the root element will still work, if in fact it is an
      # anchor.
      $('.dropdown-toggle').click ->
        location = $(@).attr('href')
        if location?
          window.location.href = location
          return false
        else
          return true

`export default applicationView`
