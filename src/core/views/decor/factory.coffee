###

Notes:

1. cstep is used so that teardown & other functions wait until the previous method is calld. For instance - 
if setup is called, then teardown immediately, then teardown MUST wait until setup is complete

###


define ["underscore",
"cstep",
"../../utils/async",
"../../factories/class",
"../../utils/idGenerator",
"./base",  
"../collection",
"../../utils/compose",
"./template",
"./children",
"./list/decorator",
"./attributes",
"./events",
"./bindings",
"./dragdrop/draggable",
"./dragdrop/droppable",
"./states/decorator",
"./transition", "./preload"], (_, cstep, async, ClassFactory, generateId, BaseViewDecorator, 
  ViewCollection, compose,
  TemplateDecorator, ChildrenDecorator, ListDecorator, 
  AttributesDecorator, EventsDecorator, BindingsDecorator, DraggableDecorator, 
  DroppableDecorator, StatesDecorator, TransitionDecorator, PreloadDecorator) ->
    

    decor = (name, clazz, inheritable = true) ->
       name        : name
       clazz       : clazz
       inheritable : inheritable


    ###
    loading order:

    1. children templates
    2. parent templates
    3. parent -> child bindings
    ###

    # note that the decorator order is very important
    availableDecorators = [

      # bindings = priority for explicit data-bindings
      decor("bindings"   , BindingsDecorator),

      # section / child decorators. These have (almost) highest
      # priority since they should be added before the template is loaded
      decor("list"       , ListDecorator),
      decor("states"     , StatesDecorator),
      decor("children"   , ChildrenDecorator),

      # loads a template, and injects the sections / children (from above) on load
      decor("template"   , TemplateDecorator, false),

      # additional decorators that don't have high priority - get added on .render() & .display()
      decor("preload"    , PreloadDecorator, false),
      decor("attributes" , AttributesDecorator),
      decor("transition" , TransitionDecorator),
      decor("events"     , EventsDecorator),
      decor("draggable"  , DraggableDecorator),
      decor("droppable"  , DroppableDecorator)
    ]



    setup: (view) ->  

      # decorators are cached in the view class
      if view.constructor.__decorators
        @setDecorators view, view.constructor.__decorators
      else
        view.constructor.__decorators = @findDecorators view.constructor
        @setup view

      
    ###
     Finds ALL the decorators for a view, including the parent 
     decorators which should be inherited (but overridden by the child prototype)
    ###

    findDecorators: (viewClass) -> 
      decorators = []

      cv = viewClass
      pv = undefined

      # inherit from the parent classes
      while cv and cv.prototype.__isView

        # attach from the class, along with the prototype. class = optimal
        decorators = decorators.concat @_findDecorators(cv, pv).concat @_findDecorators cv.prototype, pv?.prototype
        pv = cv
        cv = cv.__super__?.constructor

      decorators.sort (a, b) -> if a.priority > b.priority then 1 else -1

    ###
    ###

    _findDecorators: (proto, child) ->
      decorators = []


      for d, priority in availableDecorators
        clazz       = d.clazz

        # skip if the decorator is not inheritable
        if child and not d.inheritable
          continue

        if options = clazz.getOptions proto

          #skip if the options are exactly the same
          continue if child and options is clazz.getOptions child
          decorators.push { clazz: clazz, name: d.name, options: options, priority: priority }

      decorators

    ###
    ###

    setDecorators: (view, decorators) ->
      for decor in decorators
        d = new decor.clazz view, decor.options
        d._id = decor.name
        view.decorators.push d






















