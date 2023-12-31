import {useCallback, useState} from 'react';
import './App.css';

interface Param {
    id: number;
    name: string;
    type: 'string' | 'number';
}
interface ParamValue {
    paramId: number;
    value: string;
}
interface Model {
    paramValues: ParamValue[];
}
interface ParamsEditorProps {
    params: Param[];
    model: Model;
    onChange?: (value: Model) => void;
}

interface EditorProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    type: string | number;
}

const paramsData = [
    {
        "id": 1,
        "name": "Назначение",
        type: 'string'
    },
    {
        "id": 2,
        "name": "Длина",
        type: 'string'
    },
    {
        "id": 3,
        "name": "Вес",
        type: 'number'
    }
] satisfies Param[];

const modelData = {
    "paramValues": [
        {
            "paramId": 1,
            "value": "повседневное"
        },
        {
            "paramId": 2,
            "value": "макси"
        },
        {
            "paramId": 3,
            "value": "234"
        }
    ]
} satisfies Model;

function Editor({name, value, onChange, type}: EditorProps) {

    if(type === 'number') {
        return <div className="editor">
            <label>{ name }</label>
            <input type="number" value={value} onChange={ event => onChange(event.target.value) }/>
        </div>;
    }

    return <div className="editor">
        <label>{ name }</label>
        <input type="text" value={value} onChange={ event => onChange(event.target.value) }/>
    </div>;
}

function ParamsEditor({params, model, onChange}: ParamsEditorProps) {

    const [state, setState] = useState([...model.paramValues]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onChange?.({ paramValues: state });
    }
    const handleEditorChange = (id:number, value: string) => {
        const stateCopy = [...state];
        const stateParamIndex = state.findIndex(stateParam => stateParam.paramId === id);
        if(stateParamIndex >= 0) {
            stateCopy.splice(stateParamIndex, 1, {paramId: id, value});
        } else {
            stateCopy.push({paramId: id, value});
        }
        setState(stateCopy);
    }

    return (<form onSubmit={handleSubmit}>
        {
            params.map(param => (<Editor key={param.id}
                                         type={param.type}
                                         name={ param.name }
                                         value={ state.find(stateParam => stateParam.paramId === param.id)?.value || '' }
                                         onChange={ (value) => handleEditorChange(param.id, value) }
            />))
        }
        <input type="submit" value="Сохранить"/>
    </form>)
}

function App() {
    const [result, setResult] = useState('');

    const handleChange = useCallback((value: Model) => {
        setResult(JSON.stringify(value, null, '\t'));
    }, []);

  return (
    <>
     <ParamsEditor params={ paramsData }
                   model={ modelData }
                   onChange={handleChange}
     />

      <div className="result">
          { result }
      </div>
    </>
  )
}

export default App;
