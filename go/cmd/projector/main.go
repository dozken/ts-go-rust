package main

import (
	"fmt"
	"log"

	"github.com/dozken/ts-go-rust/pkg/projector"
)

func main() {
	opts, err := projector.GetOpts()
	if err != nil {
		log.Fatalf("unable to get opts: %v", err)
	}
  fmt.Printf("opts: %+v", opts)
}
