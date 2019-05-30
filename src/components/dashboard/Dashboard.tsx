import * as React from 'react'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { History } from 'history'
import fetchProtected from '../../../src/api/protected'
import { Header } from '../common/Header'
import CustomerView from './customer/CustomerView'
import EventPage, { EventFullDetails } from './customer/EventPage'

import './Dashboard.scss'
import { CreateEvent } from './modal/CreateEvent'

// tslint:disable-next-line:no-var-requires
const placeholderImage = require('../../../assets/png/care-bears.jpg')

const Dashboard: React.FunctionComponent<DashboardProps> = (props: DashboardProps) => {

  const [openEvent, setOpenEvent] = React.useState<EventFullDetails | undefined>(undefined)
  const [modalOpen, setModalOpen] = React.useState<boolean>(false)

  const updateTransport = (transport) => {
    fetchProtected(DASH_API + '/editTansport', null, {...transport, id: openEvent.event_id}, 'PUT', ((res) => {
      if (res.success) {
        setOpenEvent((event: EventFullDetails) => {
          event.transport = transport
          event.transport.departTime = new Date(event.transport.departTime)
          return event
        })
      }
    }))
  }

  const addAttendee = (attendee) => {
    fetchProtected(DASH_API + '/addAttendee', null, {...attendee, id: openEvent.event_id}, 'POST', (res) => {
      if (res.success) {
        setOpenEvent((event: EventFullDetails) => {
          event.attendees.push(attendee)
          return event
        })
      }
    })
  }

  const editEvent = (event) => {
    fetchProtected(DASH_API + '/editEvent', null, { ...event, id: openEvent.event_id}, 'PUT', (res) => {
      if (res.success) {
        setOpenEvent((currentEvent: EventFullDetails) => {
          return {
            ...currentEvent,
            ...event,
          }
        })
      }
    })
  }

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleSetEvent = (id?: number) => () => {
    console.log('Set event', id)
    if (id !== undefined) {
      /* Fetch from endpoint */
      console.log('Fetching', `/api/fullevent?id=${id}`)
      fetchProtected(`${DASH_API}/fullevent?id=${id}`, null, null, 'GET', (res) => {
        setOpenEvent({
          ...res.events,
          image_path: placeholderImage,
          date: new Date(res.events.date),
          attendees: res.attendees,
          transport: {
            ...res.transport,
            departTime: new Date(res.transport.departTime),
          },
        })
      })
    } else {
      setOpenEvent(undefined)
    }
  }

  return (
    <div className='dashboard-view'>
      <Header history={props.history} />
      {openEvent === undefined ? (
        <div>
          <CustomerView history={props.history} setActiveEvent={handleSetEvent} />
          <Fab className='dashboard-fab' variant='extended' color='primary' onClick={handleModalOpen}>
            <AddIcon className='dashboard-add-icon' />
            Add event
          </Fab>
        </div>
      ) : (
        <EventPage {...openEvent} backAction={handleSetEvent()} />
      )}
      <CreateEvent open={modalOpen} onClose={handleModalClose} />
    </div>
  )
}

interface DashboardProps {
  history: History
}

export default Dashboard