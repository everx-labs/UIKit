
const url = '';

export const localData = {
    countries: undefined
};

export const loadData = () => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response: Response) => response.json())
            .then((remoteData: any) => {
                resolve(remoteData)
            })
            .catch(reject)
    })
  }
