define ["../../../collection", "../../../adapters/index", "dref", "hoist", "pilot-block"], (ViewCollection, adapters, dref, hoist, pilot) ->
  
  class ListSection
    constructor: (@view, @name, @options) ->

      # the source of the list - string, or object
      @__source       = @options.source

      # the view class for each model
      @_modelViewClass = adapters.getViewClass @options.modelViewClass or @options.itemViewClass # itemViewClass = DEPRECATED

      @_viewCollection = @modelViews = new ViewCollection()
      @_viewCollection.bind({ remove: @_removeModelView }).now()

      @_deferredSections = []
      @section = pilot.createSection()

    ###
    ###

    toString: () -> 
      @section.toString()


    load: (next) ->

      # init the list on load so property bindings
      # can be properly inherited
      @initList()

      @_fetchRemote () =>
        @_viewCollection.load next

    ###
    ###

    _fetchRemote: (next) -> 
      return next() if @_viewCollection.length() or not @_sourceCollection?.fetch
      @_sourceCollection?.fetch next

    ###
    ###

    render: (next) -> @_viewCollection.render next

    ###
    ###

    display: (next) -> @_viewCollection.display next

    ###
    ###

    remove: (next) ->
      @_sourceBinding?.dispose()
      @_sourceBinding = undefined
      @_viewCollection.remove next

    ###
    ### 

    initList: () -> 
      hoister = hoist()
      map = @options.map or @options.transform

      if map
        hoister.map (model) => map model, @

      @_modelTransformer = hoister.
      map((model) => 
        ops = {}

        # DEPRECATE
        ops.item  = model
        ops.model = model

        ops._id = dref.get(model, "_id")
        ops
      ).
      cast(@_modelViewClass).
      map((model) =>
        @_hookModelView model
        model
      )

      @_bindSource()

    ###
    ###

    _onSourceChange: (source) => 


      @_viewCollection.source []
      @_deferredSections = []

      # might be a bindable.Collection / backbone / spine collection
      @_sourceCollection = adapters.getCollection source


      @_sourceBinding?.dispose()
      @_sourceBinding = binding = @_sourceCollection.bind()

      if @options.filter
        @_sourceBinding.filter @options.filter

      binding.transform(@_modelTransformer).to(@_viewCollection).now()

    ###
    ###

    _bindSource: () ->
      return if not @__source
      if typeof @__source is "string"
        @_bindSourceString()
      else
        @_bindSourceInst()

    ###
    ###

    _bindSourceString: () -> @view.bind(@__source, @_onSourceChange).now()

    ###
    ###

    _bindSourceInst: () ->
      @_onSourceChange @__source

    ###
    ###

    _hookModelView: (modelView) =>

      self = @

      @view.linkChild modelView

      modelView.decorators.push
        load: (next) ->


          # defer section insertion so we don't kill DOM rendering - this is only a ~1 MS delay.
          # NOT doing this might result in a max call stack issue with FFox, and IE
          if self._loaded
            self._deferInsert modelView.section
          else
            self.section.append modelView.section


          next()
      

      modelView

    ###
    ###

    _deferInsert: (section) ->  
      @_deferredSections.push(section)
      @_deferInsert2()

    ###
    ###

    _deferInsert2: () ->
      clearTimeout @_deferInsertTimeout
      @_deferInsertTimeout = setTimeout @_insertDeferredSections, 0

    ###
    ###

    _insertDeferredSections: () =>
      @section.append @_deferredSections...
      @_deferredSections = []

    ###
    ###

    _removeModelView: (modelView) => 
      return if not modelView
      modelView.remove()

    @test: (options) -> options.type is "list"

  ListSection