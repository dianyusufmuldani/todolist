import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeaderApp from "../component/header";
import ImageEmpty from "../assets/todo-empty-state.png";
import axios from "axios";
import ModalEdit from "../component/modalEdit";
import ToastedDeleteSuccess from "../component/toastedDeleteSuccess";
import ModalDelete from "../component/modalDelete";
import ModalAddItems from "../component/modalAddItems";
import ModalSelectSort from "../component/modalSelectSort";

const Detail = () => {
  const [data, setData] = useState([]);
  const [dataOne, setDataOne] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSelectPriority, setShowSelectPriority] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalDeleteSuccess, setShowModalDeleteSuccess] = useState(false);
  const [showModalEditItem, setShowModalEditItem] = useState(false);
  const [showAddItems, setShowAddItems] = useState(false);
  const [itemName, setItemName] = useState(null);
  const [priority, setPriority] = useState("Pilih Priority");
  const [title, setTitle] = useState("");
  const [dataTitle, setDataTitle] = useState(null);
  const [sorted, setSorted] = useState({ sorted: "title", reversed: false });
  const [showSelectSort, setShowSelectSort] = useState(false);
  const [lifecycle, setLifecycle] = useState(null);
  const inputRef = useRef();
  const params = useParams();
  const { id } = params;
  console.log("isi data", title);
  const clickForFocusInput = () => {
    inputRef.current.focus();
  };
  useEffect(() => {
    if (data !== null || data !== undefined) {
      axios
        .get(`https://todo.api.devcode.gethired.id/activity-groups/${id}`)
        .then((res) => {
          // setData(res.data.todo_items);
          console.log("Success get 1 data ok", res.data.todo_items);
          setDataTitle(res.data.title);
          let sorted = res.data.todo_items.sort((b, a) => a.id - b.id);
          setData(sorted);
        });
    } else {
    }
  }, [dataTitle, lifecycle, dataOne]);

  const SortAscending = () => {
    let sorted = [...data];
    if (sorted.length > 0) {
      let result = sorted.sort((a, b) => a.title.localeCompare(b.title));
      console.log("hasil", result);
      setData(result);
    }
  };
  const SortDescending = () => {
    let sorted = [...data];
    if (sorted.length > 0) {
      let result = sorted.sort((b, a) => a.title.localeCompare(b.title));
      console.log("hasil", result);
      setData(result);
    }
  };
  const SortTerbaru = () => {
    let sorted = data.sort((b, a) => a.id - b.id);
    console.log("hasil", sorted);
    setData(sorted);
  };
  const SortTerlama = () => {
    let sorted = data.sort((a, b) => a.id - b.id);
    console.log("hasil", sorted);
    setData(sorted);
  };
  const SortBelumSelesai = () => {
    let sorted = data.sort((b, a) => a.is_active - b.is_active);
    console.log("hasil", sorted);
    setData(sorted);
  };

  const handleEditActivity = () => {
    if (showEdit === true) {
      const request = { title: title };
      axios
        .patch(
          `https://todo.api.devcode.gethired.id/activity-groups/${id}`,
          request
        )
        .then((res) => {
          console.log("Edited", res);
          setLifecycle(res.status);
        });
      setShowEdit(false);
    } else {
      console.log("Gagal");
    }
  };

  const handleAddItems = (itemName, priority) => {
    const request = {
      title: itemName,
      activity_group_id: id,
      priority: priority,
    };

    axios
      .post("https://todo.api.devcode.gethired.id/todo-items", request)
      .then((res) => {
        console.log(res.status);
        setDataOne(res.status);
      });
  };
  const handleSaveEditItem = (nameItem, priority) => {
    console.log("isinya", nameItem, priority, dataOne.id);
    const request = { title: nameItem, priority: priority };
    axios
      .patch(
        `https://todo.api.devcode.gethired.id/todo-items/${dataOne.id}`,
        request
      )
      .then((res) => {
        console.log("updated", res);
        setLifecycle(res.status);
        setDataOne(null);
        setShowModalEditItem(false);
      });
  };
  useEffect(() => {
    if (dataOne !== null || lifecycle !== null) {
      if (dataOne === 201) {
        setShowAddItems(false);
        setDataOne(null);
      } else if (lifecycle === 200) {
        setLifecycle(null);
      }
    }
  }, [dataOne, lifecycle]);

  const handleDeleteItems = () => {
    axios
      .delete(`https://todo.api.devcode.gethired.id/todo-items/${dataOne.id}`)
      .then((res) => {
        console.log("item deleted", res);
        setLifecycle(200);
      });
    setShowModalDelete(false);
    setShowModalDeleteSuccess(true);
  };

  const handleActiveItems = (item) => {
    const request = { is_active: 0 };
    axios
      .patch(
        `https://todo.api.devcode.gethired.id/todo-items/${item.id}`,
        request
      )
      .then((res) => {
        console.log("not active", res);
        setLifecycle(res.status);
      });
  };
  const handleInActiveItems = (item) => {
    const request = { is_active: 1 };
    axios
      .patch(
        `https://todo.api.devcode.gethired.id/todo-items/${item.id}`,
        request
      )
      .then((res) => {
        console.log("actived", res);
        setLifecycle(res.status);
      });
  };
  return (
    <>
      <HeaderApp />

      <main
        className="mx-auto flex w-full max-w-[1000px] flex-col py-11"
        data-cy="activity-item"
      >
        <ModalAddItems
          handleAddItems={handleAddItems}
          showAddItems={showAddItems}
          handleCloseModalAddItems={() => setShowAddItems(false)}
        />
        <ModalDelete
          handleCancelModal={() => setShowModalDelete(false)}
          handleDeleteItems={handleDeleteItems}
          showModalDelete={showModalDelete}
          dataOne={dataOne}
        />
        <ToastedDeleteSuccess
          showModalDeleteSuccess={showModalDeleteSuccess}
          handleCancelToasted={() => setShowModalDeleteSuccess(false)}
        />
        <ModalEdit
          showModalEditItem={showModalEditItem}
          showSelectPriority={showSelectPriority}
          handleCancelEditItem={() => setShowModalEditItem(false)}
          handleSelectPriority={() =>
            setShowSelectPriority(!showSelectPriority)
          }
          handleSave={handleSaveEditItem}
          dataOne={dataOne}
        />
        <div className="flex h-[54px] items-center gap-5">
          <a data-cy="todo-back-button" className="mr-2" href="/">
            <svg
              width={16}
              height={24}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m3.667 12 8 8M3.667 12l8-8"
                stroke="#111"
                strokeWidth={5}
                strokeLinecap="square"
              ></path>
            </svg>
          </a>
          <input
            type="text"
            className="border-b border-black bg-transparent text-4xl font-bold outline-none -mb-px w-full"
            value={title}
            onChange={(value) => setTitle(value.target.value)}
            hidden={!showEdit}
            onBlur={handleEditActivity}
            ref={inputRef}
          ></input>
          <h1
            onClick={() => {
              setShowEdit(true);
              if (title === "") {
                setTitle(dataTitle);
              }
              setTimeout(() => {
                clickForFocusInput();
              }, 100);
            }}
            data-cy="todo-title"
            className="text-4xl font-bold"
            hidden={showEdit}
          >
            {dataTitle}
          </h1>
          <button
            data-cy="todo-title-edit-button"
            onClick={() => {
              handleEditActivity();
              setShowEdit(!showEdit);
              if (title === "") {
                setTitle(dataTitle);
              }
              setTimeout(() => {
                clickForFocusInput();
              }, 100);
            }}
          >
            <svg
              width={24}
              height={24}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 20h4L18.5 9.5a2.829 2.829 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4"
                stroke="#A4A4A4"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          {data.length !== 0 ? (
            <div className="relative ml-auto">
              <button
                data-cy="todo-sort-button"
                className="border-primary h-[54px] w-[54px] rounded-full border z-0"
                onClick={() => setShowSelectSort(!showSelectSort)}
              >
                <svg
                  width={24}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path
                    d="m3 9 4-4m0 0 4 4M7 5v14M21 15l-4 4m0 0-4-4m4 4V5"
                    stroke="#888"
                    strokeWidth={1.5}
                    strokeLinecap="square"
                  ></path>
                </svg>
              </button>
              <ModalSelectSort
                showSelectSort={showSelectSort}
                handleAZ={() => {
                  SortAscending();
                  setShowSelectSort(false);
                }}
                handleZA={() => {
                  SortDescending();
                  setShowSelectSort(false);
                }}
                handleTerbaru={() => {
                  setShowSelectSort(false);
                  SortTerbaru();
                }}
                handleTerlama={() => {
                  setShowSelectSort(false);
                  SortTerlama();
                }}
                handleBelumSelesai={() => {
                  setShowSelectSort(false);
                  SortBelumSelesai();
                }}
              />
            </div>
          ) : null}
          <button
            onClick={() => setShowAddItems(true)}
            data-cy="todo-add-button"
            className="flex h-[54px] items-center gap-[6px] rounded-full px-7 font-semibold hover:opacity-70 bg-primary text-white "
          >
            <svg
              width={24}
              height={24}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              ></path>
            </svg>
            Tambah
          </button>
        </div>
        {data.length === 0 ? (
          <button data-cy="todo-empty-state" className="mx-auto mt-24">
            <img src={ImageEmpty} width={391} height={353}></img>
          </button>
        ) : (
          <>
            {data.map((item, index) => {
              return (
                <div key={index} className="mt-5 flex flex-col gap-[10px]">
                  <div
                    data-cy="todo-item"
                    className="flex h-20 items-center gap-4 rounded-xl bg-white px-7 text-lg font-medium shadow-lg"
                  >
                    {item.is_active == 1 ? (
                      <>
                        <span
                          onClick={() => handleActiveItems(item)}
                          data-cy="todo-item-checkbox"
                          className="border-secondary h-5 w-5 cursor-pointer border flex items-center justify-center z-20"
                        ></span>
                        <span
                          data-cy="todo-item-priority-indicator"
                          className="rounded-full h-[9px] w-[9px]"
                        ></span>
                        <h3 data-cy="todo-item-title">{item.title}</h3>
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() => handleInActiveItems(item)}
                          data-cy="todo-item-checkbox"
                          className="h-5 w-5 cursor-pointer border flex items-center justify-center border-blue bg-primary  z-20"
                        >
                          <svg
                            width={14}
                            height={14}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="m2.917 7 2.916 2.917 5.833-5.834"
                              stroke="#fff"
                              strokeWidth={2}
                              strokeLinecap="square"
                            ></path>
                          </svg>
                        </span>
                        <span
                          data-cy="todo-item-priority-indicator"
                          className="rounded-full h-[9px] w-[9px]"
                        ></span>
                        <h3 data-cy="todo-item-title">
                          <s>{item.title}</s>
                        </h3>
                      </>
                    )}
                    <button
                      data-cy="todo-item-edit-button"
                      onClick={() => {
                        setShowModalEditItem(true);
                        setDataOne(item);
                      }}
                    >
                      <svg
                        width={24}
                        height={24}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 20h4L18.5 9.5a2.829 2.829 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4"
                          stroke="#A4A4A4"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <button
                      data-cy="todo-item-delete-button"
                      className="ml-auto z-10"
                      onClick={() => {
                        setShowModalDelete(true);
                        setDataOne(item);
                      }}
                    >
                      <svg
                        width={24}
                        height={24}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                          stroke="#888"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>
    </>
  );
};

export default Detail;
