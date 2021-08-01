import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ItemList from '../../containers/ItemList';
import CreateMenu from '../../containers/CreateMenu';
import StyledIconButton from '../../containers/StyledIconButton';
import DownloadIcon from '@material-ui/icons/GetApp';
import UploadIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';
import arrayMove from 'array-move';
import { v4 as uuidv4 } from 'uuid';
import './Popup.css';

function Popup(props) {
  let [state, setState] = useState({
    data: [], // categories
    disabled: [], // list of category ids
    appending: {
      id: '', // category id of which category we are appending to
      category: false, // whether or not we are creating a new category or appending to an existing category
    },
    editing: {
      id: '', // category id of which category we are editing,
      index: -1, // index of which item we are editing in the category, -1 if we are editing the category itself
    },
  });
  let intervals = [];
  let fileInput = useRef(null);

  // load data from localStorage
  const loadData = (set = false) => {
    if (
      localStorage.getItem('items') == null ||
      localStorage.getItem('items') == ''
    ) {
      localStorage.setItem(
        'items',
        JSON.stringify([
          {
            title: 'main',
            color: '#D1D1D1',
            items: [],
          },
        ])
      );
      console.log('Initialized data');
    } else {
      let data = JSON.parse(localStorage.getItem('items'));
      data = data.map((category) => {
        return {
          title: category.title,
          items: category.items.map((item) => {
            if (item.type == 'interval') {
              return {
                name: item.name,
                type: item.type,
                data: {
                  days: item.data.days,
                  initial: new Date(Date.parse(item.data.initial)),
                },
                color: item.color,
              };
            } else {
              return {
                name: item.name,
                type: item.type,
                data: new Date(Date.parse(item.data)),
                color: item.color,
              };
            }
          }),
        };
      });

      if (!set) {
        [state, setState] = useState({
          ...state,
          data: data,
        });
        console.log('Loaded data');
      } else {
        setState({ ...state, data: data }, () => {
          console.log('Loaded data');
        });
      }
    }
  };

  // when a card has been dragged from a source to a destination succesfully
  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(source);
    console.log(destination);

    // dropped outside the list / list is collapsed
    if (!destination || state.disabled.includes(destination.droppableId)) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      let categoryIndex = state.data.findIndex(
        (category) => category.title == source.droppableId
      );

      let category = state.data[categoryIndex];

      category = {
        title: category.title,
        items: arrayMove(
          state.data[categoryIndex].items,
          source.index,
          destination.index
        ),
      };

      let data = state.data;
      data.splice(categoryIndex, 1, category);

      setState(
        {
          ...state,
          data: data,
        },
        () => {
          console.log(data);
        }
      );
    } else {
      let sourceIndex = state.data.findIndex(
        (category) => category.title == source.droppableId
      );
      let destinationIndex = state.data.findIndex(
        (category) => category.title == destination.droppableId
      );

      let sourceList = state.data[sourceIndex];
      let [removed] = sourceList.items.splice(source.index, 1);

      let destinationList = state.data[destinationIndex];
      destinationList.items.splice(destination.index, 0, removed);

      let data = state.data;
      data.splice(sourceIndex, 1, sourceList);
      data.splice(destinationIndex, 1, destinationList);

      setState(
        {
          ...state,
          data: data,
        },
        () => {
          console.log(data);
        }
      );
    }
  };

  // when a category collapses its cards
  const onCollapse = (id) => {
    setState({
      ...state,
      disabled: state.disabled.concat([id]),
    });
  };

  // when a category expands its cards
  const onExpand = (id) => {
    let disabled = state.disabled;
    let index = disabled.findIndex((x) => x == id);
    if (index > -1) {
      disabled.splice(index, 1);
      setState({
        ...state,
        disabled: disabled,
      });
    }
  };

  // when a category requests a new card
  const onAppend = (id, category = false) => {
    setState({
      ...state,
      appending: {
        id: id,
        category: category,
      },
      editing: {
        id: '', // category id of which category we are editing,
        index: -1, // index of which item we are editing in the category, -1 if we are editing the category itself
      },
    });
  };

  // when the user has submitted data in the create menu
  const onCreate = (result) => {
    console.log(result);
    // appending card to category
    if (state.appending.id != '') {
      let index = state.data.findIndex((x) => x.title == state.appending.id);
      let category = state.data[index];
      category.items.push(result);

      let data = state.data;
      data.splice(index, 1, category);

      setState({
        ...state,
        appending: {
          id: '',
          category: false,
        },
        editing: {
          id: '', // category id of which category we are editing,
          index: -1, // index of which item we are editing in the category, -1 if we are editing the category itself
        },
        data: data,
      });
      return;
    }

    // appending category
    if (state.appending.id == '' && state.appending.category) {
      let data = state.data;
      data.unshift(result);

      setState({
        ...state,
        appending: {
          id: '',
          category: false,
        },
        editing: {
          id: '', // category id of which category we are editing,
          index: -1, // index of which item we are editing in the category, -1 if we are editing the category itself
        },
        data: data,
      });
      return;
    }
  };

  // when the user has canceled submitting any data in the create menu
  const onCancel = () => {
    setState({
      ...state,
      appending: {
        id: '',
        category: false,
      },
      editing: {
        id: '',
        index: -1,
      },
    });
    return;
  };

  // upload data and save to local storage by .json file
  const uploadData = () => {};

  // download data from local storage and save as .json file
  const downloadData = () => {};

  loadData();

  return (
    <div>
      <input
        onChange={uploadData}
        ref={fileInput}
        type="file"
        style={{
          display: 'none',
        }}
      ></input>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '165px',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <StyledIconButton onClick={downloadData}>
            <DownloadIcon />
          </StyledIconButton>

          <StyledIconButton
            onClick={() => {
              onAppend('', true);
            }}
          >
            <AddIcon />
          </StyledIconButton>

          <StyledIconButton
            onClick={() => {
              fileInput.current.click();
            }}
          >
            <UploadIcon />
          </StyledIconButton>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="drag-drop-context">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                background: 'blue',
                width: '492px',
                marginBottom: 10,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {state.data.map((category, index) => {
                return (
                  <Draggable
                    key="drag-drop-context"
                    draggableId="drag-drop-context"
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          userSelect: 'none',
                          width: '95%',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <ItemList
                          uuid={uuidv4()}
                          data={category}
                          onInterval={(id) => intervals.push(id)}
                          onCollapse={onCollapse}
                          onExpand={onExpand}
                          onAppend={onAppend}
                        ></ItemList>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
        {/* {state.data.map((category, index) => {
          console.log(category);
          return (
            <ItemList
              uuid={uuidv4()}
              data={category}
              onInterval={(id) => intervals.push(id)}
              onCollapse={onCollapse}
              onExpand={onExpand}
              onAppend={onAppend}
            ></ItemList>
          );
        })} */}
      </DragDropContext>

      <CreateMenu
        id={uuidv4()}
        onCreate={onCreate}
        onCancel={onCancel}
        // disable category checkbox if we are appending to a category or if we are editing a card
        disableCategory={
          (state.appending.id != '' && !state.appending.category) ||
          (state.editing.id != '' && state.editing.index > -1)
        }
        disabled={
          state.appending.id == '' &&
          !state.appending.category &&
          state.editing.id == ''
        }
        item={state.editing.id != '' ? state.editing : undefined}
      />
    </div>
  );
}

export default Popup;
