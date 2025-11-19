import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
 
function Info({ totalPrice }) {  
  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice.total}
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Price"} />
          <Typography variant="body1" fontWeight="medium">
            {totalPrice.price}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Quantity"} />
          <Typography variant="body1" fontWeight="medium">
            {totalPrice.quantity}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Farmer name"} />
          <Typography variant="body1" fontWeight="medium">
            {totalPrice.farmername}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Crop name"} />
          <Typography variant="body1" fontWeight="medium">
            {totalPrice.Crop}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.string.isRequired,
};

export default Info;
