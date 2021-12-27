import {folder, LevaPanel, levaStore, useControls, useCreateStore} from "leva";
import {AAppState} from 'src/anigraph';
import {useEffect, useState} from "react";
import {useSnapshot} from "valtio";

// let appState = AAppState.GetAppState();
// @ts-ignore
function RenewStore({ controlSpecs, setStore }) {
  const store = useCreateStore();
  useEffect(() => {
    setStore(store);
  }, [setStore, store]);
  useControls(controlSpecs, { store });
  return <></>;
}
// @ts-ignore
export function ControlPanel({ appState }) {
    // @ts-ignore
    let standardControls = AAppState.GetAppState().getControlPanelStandardSpec();
    const [store, setStore] = useState(levaStore);
    const state = useSnapshot(appState.state);
    // const selectionModelState = useSnapshot(appState.selectionModel.state);

    return (
      <>
        <LevaPanel store={store} />
        <RenewStore
          key={state._guiKey}
          controlSpecs={{
            ...standardControls,
            ModelGUI: folder({
              ...appState.selectionModel.getModelGUIControlSpecs(),
            }),
          }}
          setStore={setStore}
        />
      </>
    );
}
//##################//--old--\\##################
//<editor-fold desc="old">
//</editor-fold>
//##################\\--old--//##################
