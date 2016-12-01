import React from 'react'
import 'isomorphic-fetch'
import { createAction } from 'redux-actions'
import { getLocalExtensionByName } from '../../utils/extensions'

export const FETCH_EXTENSIONS_LISTS_REQUEST = 'FETCH_EXTENSIONS_LISTS_REQUEST'
export const FETCH_EXTENSIONS_LISTS_SUCCESS = 'FETCH_EXTENSIONS_LISTS_SUCCESS'
export const FETCH_EXTENSIONS_LISTS_FAILED = 'FETCH_EXTENSIONS_LISTS_FAILED'

export const FETCH_EXTENSION_BY_NAME_REQUEST = 'FETCH_EXTENSION_BY_NAME_REQUEST'
export const FETCH_EXTENSION_BY_NAME_SUCCESS = 'FETCH_EXTENSION_BY_NAME_SUCCESS'
export const FETCH_EXTENSION_BY_NAME_FAILED = 'FETCH_EXTENSION_BY_NAME_FAILED'

export const INSTALL_LOCAL_EXTENSION = 'INSTALL_LOCAL_EXTENSION'
export const UNINSTALL_LOCAL_EXTENSION = 'UNINSTALL_LOCAL_EXTENSION'

export const fetchExtensionsListSuccess = createAction(FETCH_EXTENSIONS_LISTS_SUCCESS, data => data)
// install extension
export const installLocalExtension = createAction(INSTALL_LOCAL_EXTENSION, name => {
  const installScript = getLocalExtensionByName(name)
  // install script
  const tmpExtension = eval(installScript)
  if (!tmpExtension || !installScript) return
  // install in window
  window.extensions[name] = React.createElement(tmpExtension.app)
  return { name, data: tmpExtension.config }
})

export const uninstallExtensionByName = createAction(UNINSTALL_LOCAL_EXTENSION, name => name)


// export const fetchExtensionByNameSuccess = createAction(FETCH_EXTENSION_BY_NAME_SUCCESS, data => data)
// get list
export const fetchExtensionsLists = () => (dispatch) => {
  dispatch({ type: FETCH_EXTENSIONS_LISTS_REQUEST })
  fetch('http://localhost:8083/extensions')
  .then(response => response.json())
  .then(data => dispatch(fetchExtensionsListSuccess(data)))
  .catch({ type: FETCH_EXTENSIONS_LISTS_FAILED })
}

export const fetchExtensionByName = (name) => (dispatch) => {
  dispatch({ type: FETCH_EXTENSION_BY_NAME_REQUEST })
  fetch(`http://localhost:8083/extension?name=${name}`)
  .then(response => response.text())
  .then(script => {
    localStorage.setItem(`extension_${name}`, script)
    dispatch({ type: FETCH_EXTENSION_BY_NAME_SUCCESS })
  })
}
