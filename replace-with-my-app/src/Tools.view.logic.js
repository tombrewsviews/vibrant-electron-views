import React, { useEffect, useState, useRef } from 'react'
import RobustWebSocket from 'robust-websocket'
import Tools from './Tools.view.js'
import uuid from 'uuid'

let CLIENT_ID = uuid()

export default function ToolsLogic(props) {
  let queue = useRef(new Map())
  let listeners = useRef(new Map())
  let [status, setStatus] = useState('loading')
  let ws = useRef()

  function send(action) {
    if (status !== 'ready') return

    if (ws.current.readyState !== WebSocket.OPEN) {
      console.debug({
        type: 'views/tools/not-connected',
        wsReadyState: ws.current.readyState,
      })
      return
    }

    return new Promise((resolve, reject) => {
      let id = uuid()
      
      queue.current.set(id, [resolve, reject])
      ws.current.send(JSON.stringify([id, action]))
    })
  }

  function listen(type, callback) {
    if (status !== 'ready') return

    if (!listeners.current.has(type)) {
      listeners.current.set(type, new Set())
    }
    
    listeners.current.get(type).add(callback)

    return () => {
      
      listeners.current.get(type).delete(callback)
    }
  }

  useEffect(() => {
    setStatus('loading')

    ws.current = new RobustWebSocket('ws://localhost:55005/')

    function onReady() {
      setStatus('ready')
    }

    ws.current.addEventListener('open', onReady)

    function onError() {
      setStatus('error')
    }
    ws.current.addEventListener('error', onError)

    function onMessage(message) {
      try {
        let [id, result] = JSON.parse(message.data)
        

        if (result && listeners.current.has(result.type)) {
          listeners.current
            .get(result.type)
            .forEach(callback => callback(result))
          return
        }

        if (!queue.current.has(id)) {
          
          return
        }

        let [resolve, reject] = queue.current.get(id)

        if (result && result.error) {
          reject(result.error)
        } else {
          resolve(result)
        }

        queue.current.delete(id)
      } catch (error) {
        console.error(error)
        console.error(message)
      }
    }
    ws.current.addEventListener('message', onMessage)

    return () => {
      ws.current.removeEventListener('open', onReady)
      ws.current.removeEventListener('error', onError)
      ws.current.removeEventListener('message', onMessage)
    }
  }, [])

  let [flowState, flowDispatch] = props.flow

  useEffect(() => {
    if (status !== 'ready') return

    send({
      type: 'client:ready',
      app: '/Users/tomparandyk/Documents/Apps/patient-portal',
      id: CLIENT_ID,
    })

    return listen('client:sync', action => {
      flowDispatch({ type: 'flow/SYNC', id: action.id, flow: action.flow })
    })
  }, [status]) // eslint-disable-line
  // ignore flowDispatch, listen, and send

  useEffect(() => {
    if (status !== 'ready') return

    send({
      type: 'client:setFlow',
      app: '/Users/tomparandyk/Documents/Apps/patient-portal',
      id: CLIENT_ID,
      flow: [...flowState.flow],
      flowAction: flowState.actions[0],
    })
  }, [status, flowState]) // eslint-disable-line
  // ignore send

  return (
    <>
      <Tools status={status} />
      {props.children}
    </>
  )
}
