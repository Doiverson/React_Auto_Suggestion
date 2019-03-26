import React from 'react';
import Autosuggest from 'react-autosuggest';
import Moon from './Moon';

const moon = new Moon();


// const languages = [
//     {
//         name: 'C',
//         year: 1972
//     },
//     {
//         name: 'C#',
//         year: 2000
//     },
//     {
//         name: 'C++',
//         year: 1983
//     },
//     {
//         name: 'Clojure',
//         year: 2007
//     },
//     {
//         name: 'Elm',
//         year: 2012
//     },
//     {
//         name: 'Go',
//         year: 2009
//     },
//     {
//         name: 'Haskell',
//         year: 1990
//     },
//     {
//         name: 'Java',
//         year: 1995
//     },
//     {
//         name: 'Javascript',
//         year: 1995
//     },
//     {
//         name: 'Perl',
//         year: 1987
//     },
//     {
//         name: 'PHP',
//         year: 1995
//     },
//     {
//         name: 'Python',
//         year: 1991
//     },
//     {
//         name: 'Ruby',
//         year: 1995
//     },
//     {
//         name: 'Scala',
//         year: 2003
//     }
// ];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const getSuggestions = (value, areaList) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : areaList.filter(lang => // 2: ここで "areaList" にフィルターをかける
        lang.toLowerCase().slice(0, inputLength) === inputValue
    );
};

function getSuggestionValue(suggestion) {
    return suggestion;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion}</span>
    );
}

class MyAutosuggest extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            areaList: [],
            prov: []
        };
    }

    componentWillMount() {
        moon
            .get('api/area/all')
            .then(res =>{

                let provArray = [];

                for(let i = 0; i < res.data.length; i++) {
                    let obj = {};
                    obj['id'] = res.data[i]._id;
                    obj['name'] = res.data[i].name;
                    provArray.push(obj);
                }

                this.setState({
                    prov: provArray });
            })
            .catch(err => {
                // this.disabledInput();
                console.log(JSON.stringify(err));
            })
    }

    onChange = (_, { newValue }) => {
        const { id, onChange } = this.props;

        this.setState({
            value: newValue
        });

        onChange(id, newValue);
        console.log("!!!!!!!!!!"+onChange);
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value, this.state.areaList)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getProvFrom = (e) => {

        e.persist();

        this.state.prov.forEach(prov => {

            if(prov.name === e.target.value ){

                moon
                    .get(`api/area/search/citylist/byareaid/${prov.id}`)
                    .then(res =>{
                        this.setState({isLoading:false})
                        // this.state.areaList.push(res.city);
                        // console.log(this.state.areaList);

                        let arrayCity = [];
                        res.data.map( eachCity => {
                            return arrayCity.push(eachCity.city);
                        });

                        this.setState({areaList:arrayCity});
                    })
                    .catch(err => {
                        // this.disabledInput();
                        console.log(JSON.stringify(err));
                    })
            } else return 0

        })


    };

    render() {
        const { id, placeholder } = this.props;
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder,
            value,
            onChange: this.onChange
        };

        console.log(onchange);

        return (
            <div>
            <select
                id="errCatch"
                onChange={this.getProvFrom}
                className="input__city-item">
                <option value=''>Province</option>
                {
                    this.state.prov.map((prov, index) =>
                        <option key={index} name="areaList">{prov.name}</option>)}
            </select>
            <Autosuggest
                id={id}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
            </div>
        );
    }
}

class Test extends React.Component {
    onChange(id, newValue) {
        console.log(`${id} changed to ${newValue}`);
    }

    render() {
        return (
            <div>

                <MyAutosuggest
                    id="type-c"
                    placeholder="Type 'c'"
                    onChange={this.onChange}
                />
                <MyAutosuggest
                    id="type-p"
                    placeholder="Type 'p'"
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Test;
