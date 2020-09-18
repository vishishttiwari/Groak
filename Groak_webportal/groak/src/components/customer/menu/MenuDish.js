/**
 * This component is used to represent each dish card in customerMenu
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { context } from '../../../globalState/globalState';

import NoImage from '../../../assets/icons/camera.png';
import CustomerVegSymbol from '../ui/vegSymbol/CustomerVegSymbol';
import { randomNumber } from '../../../catalog/Others';

const MenuDish = (props) => {
    const { dishItem, highlightText, clickHandler } = props;
    const { globalState } = useContext(context);

    const getInfoSymbols = () => {
        const dom = [];
        if (dishItem.restrictions.vegan === 'Yes') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="VV" color="green" />);
        }
        if (dishItem.restrictions.vegetarian === 'Yes') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="V" color="green" />);
        }
        if (dishItem.restrictions.vegetarian === 'No') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="NV" />);
        }
        if (dishItem.restrictions.glutenFree === 'Yes') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="GF" />);
        }
        if (dishItem.restrictions.kosher === 'Yes') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="K" />);
        }
        if (dishItem.restrictions.seaFood === 'Yes') {
            dom.push(<CustomerVegSymbol key={randomNumber()} className="info-symbol" symbol="SF" color="blue" />);
        }
        return dom;
    };

    const highlightDishItem = () => {
        if (highlightText.length > 0) {
            return (
                <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: dishItem.name.replace(new RegExp(`\\b${highlightText}`, 'i'), (match) => { return `<mark>${match}</mark>`; }),
                    }}
                />
            );
        }
        return dishItem.name;
    };

    return (
        <Card
            className="card"
            style={globalState && globalState.orderAllowedCustomer ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
            onClick={clickHandler}
        >
            <CardHeader
                title={highlightDishItem()}
                subheader={`$ ${dishItem.price.toFixed(2)}`}
            />
            {dishItem.image ? (
                <CardMedia
                    className="media"
                    src={(dishItem.image) ? dishItem.image : NoImage}
                    title={dishItem.name}
                    component="img"
                    draggable="false"
                />
            ) : null}
            <CardContent style={{ padding: '10px' }}>
                <Typography variant="body2" color="textSecondary" component="p">
                    {dishItem.shortInfo}
                </Typography>
                <div className="info-content">
                    <div className="info-symbols">
                        {getInfoSymbols()}
                    </div>
                    {dishItem.nutrition && dishItem.nutrition.calories && dishItem.nutrition.calories > 0 ? (
                        <div>
                            {`${dishItem.nutrition.calories} kCal`}
                        </div>
                    ) : null}

                </div>
            </CardContent>
        </Card>
    );
};

MenuDish.propTypes = {
    dishItem: PropTypes.object.isRequired,
    highlightText: PropTypes.string,
    clickHandler: PropTypes.func.isRequired,
};

MenuDish.defaultProps = {
    highlightText: '',
};

export default React.memo(MenuDish);
