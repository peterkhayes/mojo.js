models       = require "../models"

BaseView     = require "./base"
ListView     = require "./list"
StatesView   = require "./states"

models.set "components.list", ListView
models.set "components.states", StatesView

module.exports = BaseView