import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    return (
        <Background/>
    );
  }
}

class Background extends Component
{
    constructor(props)
    {
        super();
        this.state = {
            numCircles: 0,
          circles: null,
        };
    }

    removeCircle(circleModel)
    {
        let circles = this.state.circles;

        if(circles.length > 0)
        {
            for (let circle of circles)
            {
                let cModel = circle.props.circleModel;

                if(cModel.circleID === circleModel.circleID)
                {
                    console.log("Found");
                    circles.splice(circles.indexOf(circle), 1);
                    console.log("CIRCLES LEFT:");
                    console.log(circles);
                    break;
                }
            }
        }

        this.setState({circles: circles});
    }

    componentDidMount()
    {
        this.setState({numCircles: 0, circles: []});
    }

    addCircle(x, y)
    {
        let circles = this.state.circles;
        // let circle = <Circle key={this.state.numCircles} x={x} y={y}/>;
        let circle = new CircleModel(this.state.numCircles, x, y);

        circles.push(<CircleView key={this.state.numCircles} circleModel={circle} removeC={(circleModel)=>this.removeCircle.bind(this)(circleModel)}/>);
        this.setState({numCircles: this.state.numCircles+1, circles: circles});
    }

    handleClick(e)
    {
        let x = e.clientX;
        let y = e.clientY;

        if(this.state.circles.length === 0)
        {
            this.addCircle(x, y);
            return;
        }

        //Comprobar si estoy tomando el circulo del arreglo de circulos
        if(this.state.circles.length >= 1) {
            if(!this.isWithinCircle(x, y))
            {
                this.addCircle(x, y);
            }

            for(let circle of this.state.circles)
            {
                console.log(circle);
            }
        }
    }

    isWithinCircle(x, y)
    {
        let circles = this.state.circles;

        console.log("Circulos:");

        for(let circle of circles)
        {
            let circleModel = circle.props.circleModel;
            let dist = this.distance(x, y, circleModel.x, circleModel.y);
            if(dist < circleModel.w/2)
            {
                console.log("Dentro de un circulo!");
                return true;
            }
        }

        console.log("Ninguno dentro de otro");
        return false;
    }

    distance(x1, y1, x2, y2)
    {
        return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2));
    }

    render()
    {
        return <div className={'App'} onClick={(e)=>this.handleClick(e)}>{this.state.circles}</div>;
    }
}

class CircleLabelView extends Component
{
    constructor(props)
    {
        super();
    }

    render()
    {
        if(this.props.visible)
        {
            return (
                <div className={'counter'}>
                    {this.props.number}
                </div>
            );
        }
        else
        {
            return(<div></div>);
        }
    }
}

class CircleModel
{
    constructor(key, x, y)
    {
        this._circleID = key;
        this._w = 100;
        this._h = 100;
        this._x = x;
        this._y = y;
        this._imgSrc = require('./circle.png');
    }

    get circleID() {
        return this._circleID;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get w() {
        return this._w;
    }

    set w(value) {
        this._w = value;
    }

    get h() {
        return this._h;
    }

    set h(value) {
        this._h = value;
    }

    get imgSrc() {
        return this._imgSrc;
    }

    set imgSrc(value) {
        this._imgSrc = value;
    }
}

//Clase que representa a un circulo
class CircleView extends Component
{
    constructor(props)
    {
        super();

        //Objeto que guarda el estado del circulo
        //la posicion x y y se obtiene mediante props
        this.state = {
            circleModel: props.circleModel,
            number: 5,
            visible: false,
            vanishing: false,
            img: null,
        };
    }

    countDown()
    {
        let newNumber = this.state.number-1;
        console.log(newNumber);
        this.setState({number: newNumber});
    }

    startTimer()
    {
        //Si ya está desapareciendo, no hace nada
        if(this.state.vanishing)
            return;

        console.log("STARTED");
        this.setState({visible: true});
        const timer = setInterval(this.countDown.bind(this), 1000);
        this.setState({vanishing: true});
        setTimeout(clearInterval, 5000, timer);
    }

    //Una vez montado el nodo, se carga la imagen del circulo
    componentDidMount()
    {
        let circleModel = this.state.circleModel;

        this.setState({
            img:
                <img
                    src={circleModel.imgSrc}
                    height={circleModel.h}
                    width={circleModel.w}
                />
        });
    }



    render()
    {
        let circleModel = this.state.circleModel;
        return (
            <div
                className={"container"}
                style={{position: "absolute", left: circleModel.x-circleModel.w/2, top: circleModel.y-circleModel.h/2}}
                onClick={()=>{
                    this.startTimer();
                    setTimeout(this.props.removeC, 5000, circleModel);
                }}
            >
                {this.state.img}
                <CircleLabelView visible={this.state.visible} number={this.state.number}/>
            </div>
        );
    }
}

export default App;
