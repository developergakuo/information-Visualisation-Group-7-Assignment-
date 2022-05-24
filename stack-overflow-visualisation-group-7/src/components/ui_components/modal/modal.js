import React from "react";
import Card from "../card/card";
import Button from "../button/button";
import classes from "./modal.module.css";

const Modal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>{props.children}</div>
        <footer className={classes.actions}>
          <Button onClick={props.onclick}> Close </Button>
        </footer>
      </Card>
    </div>
  );
};

export default Modal;
