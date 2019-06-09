import * as React from 'react'

import { Button, Card, CardActionArea, CardContent, Paper } from '@material-ui/core'
import './Form.scss'

import Save from '@material-ui/icons/Save'
import { Itinerary } from '../../../src/types/BackendTypes'

const MenuSelector: React.FunctionComponent<MenuSelectorProps> = (props) => {
  const [selection, setSelection] = React.useState(props.menu ? props.menu.menu.courses.map(() => -1) : [])

  const makeChoice = (courseIndex, dishIndex) => () => {
    setSelection((oldSelection) =>
      oldSelection.map((s, i) => (i !== courseIndex ? s : s === dishIndex ? -1 : dishIndex)),
    )
  }

  console.log(props.form_id)

  const submitChoice = () => {
    console.log('Your choice is saved')
    const body = {
      uuid: props.form_id,
      dish_ids: selection.map((s, i) => props.menu.menu.courses[i].dishes[s].dish_id),
    }

    fetch(DASH_API + '/makeChoice', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'Application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.success) {
          props.done()
        }
      })
  }

  const disabled = selection.filter((s) => s === -1).length > 0

  if (!props.menu) {
    return <h1>Something went wrong</h1>
  }

  return (
    <div className='newCourse'>
      <h1>{props.menu.name}</h1>
      <p>{props.menu.description}</p>

      {props.menu.menu.courses.map((course, cIndex) => (
        <Paper className='newCourse' key={cIndex}>
          <h1>{course.name}</h1>
          {course.dishes.map((dish, dIndex) => (
            <Card key={dIndex} className={'actionCard' + (selection[cIndex] === dIndex ? ' selected' : '')}>
              <CardActionArea onClick={makeChoice(cIndex, dIndex)}>
                <CardContent>
                  <h1>{dish.name}</h1>
                  <p>{dish.description}</p>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Paper>
      ))}
      <Button color='primary' disabled={disabled} onClick={submitChoice}>
        Save selection
        <Save />
      </Button>
    </div>
  )
}

interface MenuSelectorProps {
  menu: Itinerary
  form_id: string
  done: () => void
}

export default MenuSelector
