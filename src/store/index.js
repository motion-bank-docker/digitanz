import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'
import makeResourceModule from './modules/make-resource-module'
import auth from './modules/auth'
import acl from './modules/acl'
import conversions from './modules/conversions'
import sequences from './modules/sequences'
import logging from './modules/logging'
import metadata from './modules/metadata'
import survey from './modules/survey'
import cloud from './modules/cloud'
import recipes from './modules/recipes'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const apiClient = null

/**
 * Set up VueX store with API service backends
 */
const store = new Vuex.Store({
  modules: {
    acl,
    notifications,
    forms,
    conversions,
    sequences,
    logging,
    mosysGridEditorStore,
    annotations: makeResourceModule(apiClient, 'annotation'),
    maps: makeResourceModule(apiClient, 'map'),
    profiles: makeResourceModule(apiClient, 'profile'),
    sessions: makeResourceModule(apiClient, 'session'),
    // metadata: makeResourceModule(apiClient, 'metadata', 'metadata', process.env.TRANSCODER_HOST),
    metadata,
    survey,
    cloud,
    recipes,
    auth
  }
})

export default store
