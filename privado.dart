void main (){
Usuario usuarioFinal= Usuario("Abner","1b1b");
print(usuarioFinal.nombre);
print(usuarioFinal._serieBancaria);
}




class Usuario{
    String nombre;
    String _serieBancaria;

    Usuario(this.nombre, this._serieBancaria);
}
