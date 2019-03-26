import React from 'react';
import Autosuggest from 'react-autosuggest';
import Moon from './Moon';

const moon = new Moon();

// Imagine you have a list of languages that you'd like to autosuggest.

const getSuggestions = (value, areaList) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : areaList.filter(lang => // 2: ここで "areaList" にフィルターをかける
        lang.toLowerCase().slice(0, inputLength) === inputValue
    );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion; // 3: ここも変える

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
       {suggestion}  {/*// 4: ここでドロップダウン出力*/}
    </div>
);


/////////////////////////////////////////////////////////

export default class Example extends React.Component {
    constructor() {
        super();

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.

        this.state = {
            value: '',
            suggestions: [],

            areaList: [],
            prov: []
        };
    }

    /////////////////////////
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
    /////////////////////////

    /////////////////////////
    onChangeValue = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    /////////////////////////

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    /////////////////////////
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value, this.state.areaList) // 1: ここで "areaList" 渡す
        });
    };
    /////////////////////////

    // Autosuggest will call this function every time you need to clear suggestions.
    /////////////////////////
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    /////////////////////////

    /////////////////////////
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
    /////////////////////////

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChangeValue

        };

        // Finally, render it!
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
