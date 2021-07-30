import React, { useEffect, useRef, useState } from 'react';
import Item from './Item';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { v4 as uuidv4 } from 'uuid';

function Sortable(props) {
  const [state, setState] = useState({
    list: false,
  });
  let list = useRef(null);

  useEffect(() => {
    const SortableItem = SortableElement(({ value }) => {
      let self = value.self;
      return (
        <Item
          id={uuidv4()}
          item={value.value}
          onClose={() => {
            self.clearIntervals();
            self.delete(value.index);
          }}
          onEdit={() => {
            self.requestEdit(value.index);
          }}
          onInterval={(id) => {
            self.intervals.push(id);
          }}
        />
      );
    });

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {items.items.map((value, index) => (
            <SortableItem
              index={index}
              value={{
                value: value,
                index: index,
                self: items.self,
              }}
            />
          ))}
        </div>
      );
    });

    list.current = (
      <SortableList
        items={{
          items: props.items,
          self: props.self,
        }}
        distance={1}
        pressDelay={0}
        axis="y"
        onSortEnd={props.onSortEnd}
      />
    );
    setState({
      list: true,
    });
  }, []);

  //   return (
  //     <SortableList
  //       items={{
  //         items: props.items,
  //         self: props.self,
  //       }}
  //       distance={1}
  //       pressDelay={0}
  //       axis="y"
  //       onSortEnd={props.onSortEnd}
  //     />
  //   );
  return <div>{state.list && list.current}</div>;
}

export default Sortable;
