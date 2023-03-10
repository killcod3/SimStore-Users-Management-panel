import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
const { v4: uuidv4 } = require('uuid');
import { useState } from 'react';
import { useEffect } from 'react';

import { Link } from 'components';
import { userService, alertService } from 'services';


export { AddEdit };

function AddEdit(props) {
    const [uuidvalue, SETuuidvalue] = useState('');
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();
    const handlevalueClick = () => {
        SETuuidvalue(getuuid())
        setValue("key", uuidvalue);
        //  if (isAddMode) {
        //    // console.log(formOptions)
        //     // formOptions.register.Licence = uuidvalue;
        //  }

      }
    // useEffect(() => {
    //     if (!isAddMode) {
    //         reset(formOptions.defaultValues = props.user)
    //     }
    
  
    // },)
    
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        user: Yup.string()
            .required('First Name is required'),
        exp: Yup.string()
            .required('Expiry is required'),
        key: Yup.string()
            .required('Licence is required'),
        name: Yup.string()
            .required('ToolName is required'),
    });
     const formOptions = { resolver: yupResolver(validationSchema) };
     //const formOptions = {  };

    // set default form values if in edit mode
    if (!isAddMode) {
       formOptions.defaultValues = props.user;}
        // reset(formOptions.defaultValues);}

       // reset(formOptions.defaultValues);
    //     reset(formOptions.defaultValues)}

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState,setValue } = useForm(formOptions);
    const { errors } = formState;
    

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userService.register(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }
    function getuuid() {
    return uuidv4();        
    }
    const resetdata = ()=>{
        reset(formOptions.defaultValues)
        SETuuidvalue('')
    }

    // const handleChange=(value)=>{
    //     SETuuidvalue(value)
    //     console.log(value)
    // }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
                <div className="form-group col">
                    <label>Username</label>
                    <input name="user" type="text" {...register('user')} className={`form-control ${errors.user ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.user?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Tool Name</label>
                    <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>
                        Expiry
                        {isAddMode && <em className="ml-1">(Days from 1 to so on. 0 = Never Expire)</em>}
                        {!isAddMode && <em className="ml-1">(Days from 1 to so on. 0 = Never Expire)</em>}

                    </label>
                    <input name="exp" placeholder='Enter Days to expire.' type="text" {...register('exp')} className={`form-control ${errors.exp ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.exp?.message}</div>
                </div>
                <div className="form-group col">
                    <label>
                        Licence Key
                        {/* {!isAddMode && <em className="ml-1">(Leave blank to keep the same Licence Key)</em>} */}
                    </label>
                    {/* <button size="sm" type="button" className="testbtn btn btn-secondary" disabled={formState.isSubmitting} onClick={handlevalueClick} >Generate</button>
                    <input name="Licence"  type="text"    className={`form-control ${errors.Licence ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.Licence?.message}</div> */}
                    <div className="input-group">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary" onClick={handlevalueClick} disabled={formState.isSubmitting} type="button">Generate</button>
                    </div>
                        <input name='key' type="text" {...register('key')} aria-describedby="basic-addon1" className={`form-control ${errors.key ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.key?.message}</div>
                    </div>
                </div>
                
            </div>
            <div className="form-row">
                    <div className="form-group col">
                    <label>
                        HWID
                        {isAddMode && <em className="ml-1">(If empty first connection HWID will get binded)</em>}
                        </label>
                    <input name="hwid" type="text" {...register('hwid')} className={`form-control`} />

                    </div>

                </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={resetdata} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}