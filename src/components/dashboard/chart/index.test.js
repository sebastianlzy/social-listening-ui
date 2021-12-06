import {createData} from "./index";

test('test creation of data for dashboard', () => {

    expect(createData('2021-12-06', '2')).toEqual({
        time: '2021-12-06',
        amount: '2'
    })
})