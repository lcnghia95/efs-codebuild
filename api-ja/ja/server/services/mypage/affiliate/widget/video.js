const find = require('@server/utils/model').find

async function index(meta) {
  const data = await find('douga','detail',{
      where: {
        IsValid: 1,
        BlogPartsURL: {neq: ''},
      },
      fields: {
        Id: true,
        ContentType: true,
        ContentId: true,
        Title: true,
      },
      order: 'Id DESC',
    })

    const res = {
      u: meta.userId,
      data: [],
    }


  res.data = data.reduce((acc,  record) => {
    const pId = record.ContentId
      const title = record.Title
    if (title) {
      acc.push({
        d: record.Id,
        t: record.ContentType.toString(),
        p: pId.toString(),
        title: title,
      })
    }
    return acc
  },[])


  return res
}


module.exports = {
  index,
}
