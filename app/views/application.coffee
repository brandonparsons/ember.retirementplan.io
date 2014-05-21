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
        if location != null
          window.location.href = location
          return false
        else
          return true

      # This nify little bit of code will automatically initialize any bootstap
      # tooltips added to the DOM.  This is perfect for an Ember environment where
      # we don't have page loads and instead parts of the page are selectively
      # rendered and unrendered.
      $('body').tooltip
        selector: '[data-toggle=tooltip]'

      # Similarly for popovers...
      $('body').popover
        selector: '[data-toggle=popover]'

`export default applicationView`
