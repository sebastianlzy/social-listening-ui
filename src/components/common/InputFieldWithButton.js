import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FilledInput from "@material-ui/core/FilledInput";
import Button from "@material-ui/core/Button";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const InputFieldWithButton = (props) => {
    const classes = makeStyles((theme) => ({
        inputTextApiKey: {
            paddingLeft: theme.spacing(2),

        },
        divSubmitBtn: {
            display: "flex",
            alignItems: "center",
        }
    }))();

    const {inputValue, handleChange, handleSubmit, isDisabled, label, btnText} = props
    return (
        <Grid container spacing={4}>
            <Grid item xs={10}>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="facebookKey-appId">{label}</InputLabel>
                        <FilledInput
                            id="inputFieldWithButton-appId"
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={2} className={classes.divSubmitBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={isDisabled}
                    onClick={handleSubmit}
                    size="large"
                >
                    {btnText}
                </Button>
            </Grid>

        </Grid>
    )
}

export default InputFieldWithButton